"use client"
import { useState, useEffect } from "react"

import ExerciseForm from "./exerciseform"
import ExerciseList from "./exerciseList"

type Exercise = {
    id: string,
    name: string,
    body_part: string
}

async function fetchExercises() {
    const res = await fetch("/api/exerciseapi", {
        method: "GET",
        cache: "no-store"
    })

   if(!res.ok) {
    const text = await res.text()
    console.log(`Error failed with ${res.status}`, text)
    throw new Error(`Request failed ${res.status}`)
   }

   const { exercises } = await res.json()
   return exercises
}

export default function ExercisePanel() {
    const [exercises, setExercises] = useState<Exercise[]>([])

    async function refresh() {
        try {
            setExercises(await fetchExercises())
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        refresh()
    }, [])
    return (
        <div>
            <ExerciseForm onCreated={refresh}></ExerciseForm>
            <ExerciseList exercises={exercises} onDeleted={refresh}></ExerciseList>
        </div>
    )
}