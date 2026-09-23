import { NextResponse } from "next/server"

export async function GET() {
    return NextResponse.json({message: "Test from api route handler"})
}

export async function POST(req: Request) {
    const data =  await req.json()
    const { exercise } = data
    return  NextResponse.json({ message: "Exercise received", exercise })
}