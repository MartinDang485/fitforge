'use client'

import { useEffect, useState } from "react"

type Exercise = {
    id: string,
    name: string,
    body_part: string
}

export default function ExerciseList() {
    const [exercises, setExercises] = useState<Exercise[]>([])

    async function fetchExercises() {
        const res = await fetch("/api/exerciseapi", {
            method: "GET",
            headers: {
                "Content-Type": "application/Json"
            },
            cache: "no-store"
        })
        
        if (!res.ok) {
            const text = await res.text()
            console.log(`Request failed with error ${res.status}`, text)
            throw new Error(`Request failed ${res.status}`)
        }

        const {exercises} = await res.json()
        setExercises(exercises)
        
    }

    useEffect(() => {
        fetchExercises()
    }, [])

    return(
        <div>
            {exercises.map((ex) => (
                <div key={ex.id}>
                    <p>{ex.name} - { ex.body_part}</p>
                </div>
            ))}
        </div>
    )
}