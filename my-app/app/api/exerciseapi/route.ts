import { NextResponse } from "next/server"
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase 
        .from("exercises")
        .select()
        .order("created_at", { ascending: false })
    
    if (error) {
        return NextResponse.json({error: error.message}, {status: 500 })
    }
    return NextResponse.json({exercises: data})
}

export async function POST(req: Request) {
    const {exercise} =  await req.json()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("exercises")
        .insert({name: exercise.title, body_part: exercise.bodyPart})
        .select()
        .single()
    
    if (error) {
        return NextResponse.json({error: error.message }, { status: 500 })
    }
    return NextResponse.json({ exercise: data}, { status: 201})
   
}

