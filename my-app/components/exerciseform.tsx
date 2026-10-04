'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>New exercise</CardTitle>
                <CardDescription>Add an exercise to your library</CardDescription>
            </CardHeader>

            <form onSubmit={onSubmit}>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="bodyPart">Body Part</Label>
                        <Input id="bodypart" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}/>
                    </div>
                </CardContent>
                <CardFooter className="mt-4">
                    <Button type="submit">Add exercise</Button>
                </CardFooter>
            </form>
        </Card>
        
    )
}
        
    
