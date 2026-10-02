'use client'
import { useState } from "react"


async function PostRequest(exercise) {
    const res = await fetch('/api/exerciseapi', {
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
    return data 
}

export default function ExerciseForm({onCreated}: {onCreated: () => void}) {

    //Use usestate
    const [title, setTitle] = useState("")
    const [bodyPart, setBodyPart] = useState("")
    const [submittedE, setSubmittedE] = useState<{
        title: string
        bodyPart: string
    } | null>(null)

    async function onSubmit(e) {
        e.preventDefault()
        if(!title || !bodyPart) {
            console.log("Please fill out all fields")
            return
        }
        
        const exercise = { title, bodyPart}

        try {
            const data  = await PostRequest(exercise)
            setSubmittedE(exercise)
            onCreated()
            setTitle("")
            setBodyPart("")
            
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
              
            
            <label>Body Part</label>
            <textarea
                placeholder="Body Part"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
            />

            <button type="submit">Submit</button>
            </form>

            {submittedE && (
                <div>
                    <h2>Submitted Exercise</h2>
                    <p>Title {submittedE.title}</p>
                    <p>Body Part:  {submittedE.bodyPart}</p>
                </div>
            )}
        </div>
    )
}
        
    
