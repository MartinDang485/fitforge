"use client"
import { useState, useEffect } from "react"

import ExerciseForm from "./exerciseform"
import ExerciseList from "./exerciseList"
import WorkoutList from "./workoutList"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Exercise = {
    id: number,
    name: string,
    body_part: string
}

type Workout = {
    id: number, 
    name: string,
    exercises: Exercise[]
}
//API getter functions for exercises

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

//API getter functions for workouts
async function postWorkout(name: string, exerciseIds: number[]): Promise<void> {
    const res = await fetch("/api/workoutapi", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ workout: {name, exerciseIds}})
    })

    if (!res.ok) {
        const text = await res.text()
        console.log(`Request failed with error ${res.status}`, text)
        throw new Error(`Requested failed ${res.status}`)
    }
}

async function getWorkout() {
    const res = await fetch("/api/workoutapi", {
        method: "GET"
    })

    if(!res.ok) {
        const text = await res.text()
        console.log(`Request failed with ${res.status}`, text)
        throw new Error(`Request failed ${res.status}`)
    }

    const { workouts } = await res.json()
    return workouts
}

export default function ExercisePanel() {
    //Exercises store in usestate, to populate and pass in to child components
    const [exercises, setExercises] = useState<Exercise[]>([])
    
    //Usestate for selecting exercises when creating a new workout, & workout name
    const [selecting, setSelecting] = useState(false)
    const [selectedIDs, setSelectedIDs] = useState<number[]>([])
    const [workoutName, setWorkoutName] = useState("")
    const [workouts, setWorkouts] = useState<Workout[]>([])

    //Refresh exercises s when exercise list gets updated (added, deleted, or edited)
    async function refreshExercise() {
        try {
            setExercises(await fetchExercises())
        } catch (err) {
            console.log(err)
        }
    }

    async function refreshWorkout() {
        try {
            const data = await getWorkout()
            console.log("workouts from API:", data)
            setWorkouts(data)
        } catch (err) {
            console.log(err)
        }
    }

    //Checkbox functionality for adding exercises to workouts
    function toggleSelected(id: number) {
        setSelectedIDs((prev) => 
            prev.includes(id) ? prev.filter((x) => x!== id) : [...prev, id]
        )
    }

    async function handleSaveWorkout() {

        try {
            await postWorkout(workoutName, selectedIDs)
            await refreshWorkout()
            cancelSelecting()
        } catch (err) {
            console.log(err)
        }
    }

    function cancelSelecting() {
        setSelecting(false)
        setSelectedIDs([])
        setWorkoutName("")
    }

    useEffect(() => {
        refreshExercise()
        refreshWorkout()
    }, [])
    return (
        <div>
            <ExerciseForm onCreated={refreshExercise}></ExerciseForm>
            <ExerciseList
                 exercises={exercises} 
                 onDeleted={refreshExercise} 
                 onUpdated={refreshExercise}
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
            <WorkoutList 
                workouts={workouts}
                onDeleted={refreshWorkout}
                >
            </WorkoutList>
        </div>
    )
}