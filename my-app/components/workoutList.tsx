'use client'

import { Button } from "@/components/ui/button"

type Workout = {
    id: number, 
    name: string,
    exercises: Exercise[]
}

type Exercise = {
    id: number,
    name: string,
    body_part: string
}

//DELETE function
async function deleteWorkout(id: number) {
    const res = await fetch(`/api/workoutapi/${id}`, {
        method: "DELETE"
    })

    if(!res.ok) {
        const text = await res.text()
        console.log(`Request failed with error ${res.status}`, text)
        throw new Error(`Request failed with error ${res.status}`)
    }
}

//UPDATE function
export default function WorkoutList({workouts, onDeleted}: {workouts: Workout[], onDeleted: () => void}) {

    async function handleDelete(id: number) {
        try {
            await deleteWorkout(id)
            onDeleted()
        } catch (err) {
            console.log(err)
        }
    }
    console.log("Workout List received", workouts)
    return (
       <div>
            {workouts.map((w) => (
                <div key={w.id}>
                    <p>{w.name}</p>
                    <Button variant="destructive" onClick={() => handleDelete(w.id)}>
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    )
}