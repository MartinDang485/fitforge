import  ExerciseForm from "@/components/exerciseform"

async function getWorkouts() {
    const res = await fetch(`${process.env.NEXT_URL}/api/workoutsapi`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-store"
    })
    
    if(!res.ok) {
        const text = await res.text();
        console.error(`Error with status ${res.status}: `, text)
        throw new Error(`Request failed, ${res.status}`)
    }

    const { message } = await res.json();
    return message;
}

export default async function WorkoutsComponent() {
    const message = await getWorkouts()

    return (

        <div>
            <h2>Test from workouts route</h2>
            <h1>{message}</h1>
            <ExerciseForm></ExerciseForm>
        </div>
    )
}