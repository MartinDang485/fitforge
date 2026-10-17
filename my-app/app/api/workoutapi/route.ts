import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("workouts")
        .select("id, name, created_at, workout_exercises(exercises(id, name, body_part))")
        .order("created_at" ,{ ascending: false})

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
    const workouts = data.map((w) => ({
        id: w.id,
        name: w.name,
        created_at: w.created_at,
        exercises: w.workout_exercises.map((we) => we.exercises),
    }))

    return NextResponse.json({workouts})
}

export async function POST(req: Request) {
    try {
        const { workout } = await req.json()

        //validate inputs
        const name = typeof workout?.name === "string" ? workout.name.trim() : ""
        const exerciseIds = workout?.exerciseIds

        if (!name) {
            return NextResponse.json({ error: "Workout name is required"}, { status: 400})
        }
        if (
            exerciseIds.length === 0 || 
            !Array.isArray(exerciseIds) || 
            !exerciseIds.every((id) => typeof id === "number")
        ) {
            return NextResponse.json({error: "Select at least one exercise"}, {status: 400})
        }

        //insert into workout table
        const supabase = await createClient()

        const { data: workoutData, error: workoutError} = await supabase
            .from("workouts")
            .insert({ name })
            .select()
            .single()
        
        if (workoutError) {
            return NextResponse.json({ error: workoutError.message }, { status: 500})
        }

        //build one join row into workout_exercise table
        const rows = exerciseIds.map((exercise_id) => ({
            workout_id: workoutData.id,
            exercise_id,
        }))

        const { error: joinError} = await supabase
            .from("workout_exercises")
            .insert(rows)

        if (joinError) {
            await supabase.from("workout").delete().eq("id", workoutData.id) //Delete workout name from row 
            return NextResponse.json({error: joinError.message}, {status: 500})
        }

        return NextResponse.json({workout: workoutData}, {status: 201})
        //insert into workout_exercise table
    } catch (err) {
        return NextResponse.json({ error: "Error on POST for workoutapi"}, { status: 500})
    }
}