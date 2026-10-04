'use client'

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

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

async function updateExercise(id: string, exercise: {name: string, body_part: string}): Promise<void> {
    const res = await fetch(`/api/exerciseapi/${id}`, {
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

export default function ExerciseList({exercises, onDeleted, onUpdated, selecting, selectedIDs, onToggle}: 
    {exercises: Exercise[], onDeleted: () => void, onUpdated: () => void, selecting: boolean, selectedIDs: string[], onToggle: (id: string) => void}) {

    const [editID, seteditId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editBodyPart, setEditBodyPart] = useState("")

    function cancelEdit() {
        seteditId(null)
    }

    function startEdit(ex: Exercise) {
        seteditId(ex.id)
        setEditTitle(ex.name)
        setEditBodyPart(ex.body_part)

    }

    async function handleSave(id: string) {
        try {
            await updateExercise(id, {name: editTitle, body_part: editBodyPart})
            seteditId(null)
            onUpdated()
        } catch (err) {
            console.log(err)
        }
    }
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
                    {selecting && (
                        <div>
                            <p>{ex.name}</p>
                            <Checkbox
                                checked={selectedIDs.includes(ex.id)}
                                onCheckedChange={() => onToggle(ex.id)}
                            />
                        </div>
                    )}


                    {editID === ex.id ? (
                        <>
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                            <input
                                value={editBodyPart}
                                onChange={(e) => setEditBodyPart(e.target.value)}
                            />
                            <button onClick={() => handleSave(ex.id)}>Save</button>
                            <button onClick={() => cancelEdit()}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <p>{ex.name} --- {ex.body_part}</p>
                            <button onClick={() => handleDelete(ex.id)}>Delete</button>
                            <button onClick={() => startEdit(ex)}>Edit</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}