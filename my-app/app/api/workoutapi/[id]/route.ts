import { createClient } from '@/lib/supabase/server'
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: {params: Promise<{id: string}>}) {
    const supabase = await createClient()
    const { id } = await params

    const {data, error} = await supabase
        .from("workouts")
        .delete()
        .eq("id", id)

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

    return NextResponse.json({workout: data}, {status: 200})

}