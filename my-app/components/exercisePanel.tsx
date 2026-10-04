"use client"
import { useState, useEffect } from "react"

import ExerciseForm from "./exerciseform"
import ExerciseList from "./exerciseList"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    //Exercises store in usestate, to populate and pass in to child components
    const [exercises, setExercises] = useState<Exercise[]>([])
    
    //Usestate for selecting exercises when creating a new workout
    const [selecting, setSelecting] = useState(false)
    const [selectedIDs, setSelectedIDs] = useState<string[]>([])

    //Usestate for workouts 
    const [workoutName, setWorkoutName] = useState("")

    //Refresh workouts when exercise list gets updated (added, deleted, or edited)
    async function refresh() {
        try {
            setExercises(await fetchExercises())
        } catch (err) {
            console.log(err)
        }
    }
    //Checkbox functionality for adding exercises to workouts
    function toggleSelected(id: string) {
        setSelectedIDs((prev) => 
            prev.includes(id) ? prev.filter((x) => x!== id) : [...prev, id]
        )
    }

    function handleSaveWorkout() {
        console.log(workoutName, selectedIDs) //Call POST function here later
        cancelSelecting()
    }

    function cancelSelecting() {
        setSelecting(false)
        setSelectedIDs([])
        setWorkoutName("")
    }

    useEffect(() => {
        refresh()
    }, [])
    return (
        <div>
            <ExerciseForm onCreated={refresh}></ExerciseForm>
            <ExerciseList
                 exercises={exercises} 
                 onDeleted={refresh} 
                 onUpdated={refresh}
                 selecting={selecting}
                 selectedIDs={selectedIDs}
                 onToggle={toggleSelected}
                 >
            </ExerciseList>
            {!selecting ? (
                <Button onClick={() => setSelecting(true)}>Create Workout</Button>
            ) : (
                <div>
                    <Input
                        placeholder="Workoutname"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                    />
                    <Button onClick={() => handleSaveWorkout()}>Save Workout</Button>
                    <Button onClick={() => cancelSelecting()}>Cancel Workout</Button>
                </div>
            )}
        </div>
    )
}