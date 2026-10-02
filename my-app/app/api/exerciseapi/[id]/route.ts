import { createClient } from '@/lib/supabase/server'
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string}>}) {
    const supabase = await createClient()
    const { id } = await params
    const { data, error } = await supabase
        .from("exercises")
        .delete()
        .eq("id", id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

    return NextResponse.json({exercise: data}, {status: 200})
}

export async function PUT(req: Request, { params }: {params: Promise<{ id: string}>}) {
    const supabase = await createClient()
    const { id } = await params
    const { data, error} = await supabase
        .from("exercises")
        .update()
        .eq("id", id)
        .select()
        .single()
    
    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

    return NextResponse.json({exercise: data}, {status: 200})
}