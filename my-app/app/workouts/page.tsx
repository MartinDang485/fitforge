import  ExerciseForm from "@/components/exerciseform"
import ExerciseList from "@/components/exerciseList"

//To be function to get workouts instead of exercises
async function getWorkouts() {
    const res = await fetch(`${process.env.NEXT_URL}/api/exerciseapi`, {
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

    const { data } = await res.json();
    return data;
}

export default async function WorkoutsComponent() {
    const data = await getWorkouts()

    return (

        <div>
            <h2>All exercises</h2>
            <h1>{data}</h1>
            
            <ExerciseList></ExerciseList>
        </div>
    )
}