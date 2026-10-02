'use client'

import { useEffect, useState } from "react"
type Exercise = {
    id: string,
    name: string,
    body_part: string
}

async function deleteExercise(id: string): Promise<void> {
    const res = await fetch(`/api/exerciseapi/${id}`, {
        method: "DELETE",
    })
    if (!res.ok) {
        const text = await res.text()
        console.log(`Request failed with error ${res.status}`, text)
        throw new Error(`Request failed ${res.status}`)
    }
}

async function updateExercise(id: string, exercise): Promise<void> {
    const res = await fetch(`api/exerciseapi/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({exercise})
    })

    if (!res.ok) {
        const text = await res.text()
        console.log(`Request failed with error ${res.status}`, text)
        throw new Error(`Request failed ${res.status}`)
    }
}

export default function ExerciseList({exercises, onDeleted}: {exercises: Exercise[], onDeleted: () => void}) {

    async function handleDelete(id: string) {
        try {
            await deleteExercise(id)
            onDeleted()
        } catch (err) {
            console.log(err)
        }
    }   

    return(
        <div>
            {exercises.map((ex) => (
                <div key={ex.id}>
                    <p>{ex.name} - { ex.body_part}</p>
                    <button onClick={() => handleDelete(ex.id)}>Delete</button>
                    <button>Edit</button>
                </div>
            ))}
        </div>
    )
}