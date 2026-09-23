'use client'
import { useState } from "react"


async function PostRequest(exercise) {
    const res = await fetch('/api/workoutsapi', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({exercise})
    })

    if(!res.ok) {
        const text = await res.text()
        console.log(`Request failed with error ${res.status}`, text)
        throw new Error(`Request failed ${res.status}`)
    }

    const data = await res.json()
    return { data }
}

export default function ExerciseForm() {

    //Use usestate
    const [title, setTitle] = useState("")
    const [reps, setReps] = useState("")
    const [sets, setSets] = useState("")
    const [submittedE, setSubmittedE] = useState<{
        title: string
        reps: string
        sets: string
    } | null>(null)

    async function onSubmit(e) {
        e.preventDefault()
        if(!title || !sets || !reps) {
            console.log("Please fill out all fields")
            return
        }
        
        const exercise = { title, reps, sets}

        try {
            const { data } = await PostRequest(exercise)
            setSubmittedE(exercise)
        } catch (err) {
            console.log(err)
        }
        
    }

    return(
        <div>
        
            <form onSubmit={onSubmit}>
            <label>title</label>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
              
            
            <label>Reps</label>
            <input
                value={reps}
                onChange={(e) => setReps(e.target.value)}
            />

            <label>Sets</label>
            <input
                value={sets}
                onChange={(e) => setSets(e.target.value)}
            />
            <button type="submit">Submit</button>
            </form>

            {submittedE && (
                <div>
                    <h2>Submitted Exercise</h2>
                    <p>Title {submittedE.title}</p>
                    <p>Reps {submittedE.reps}</p>
                    <p>Sets {submittedE.sets}</p>
                </div>
            )}
        </div>
    )
}
        
    
