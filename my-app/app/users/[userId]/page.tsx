import Link from "next/link";
import { notFound } from "next/navigation"

async function getUsers(id: string) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    if(!res.ok) {
        return null
    }
    const user = await res.json()
    return user
}

export default async function userPage({params}) {

    const { userId }= await params;
    const user = await getUsers(userId);

    if(!user) {
        notFound()
    }
    return (
        <div>
            <Link href={"./"}>Back</Link>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.username}</p>
        </div>
    )
}