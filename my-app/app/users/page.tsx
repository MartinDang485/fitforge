import Link from "next/link";

export default async function Users() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users")

    if(!res.ok) {
        return null
    }
    const users = await res.json()

    return (
        <div>
            <h3>Users Page</h3>
            <Link href={"/"}>Home</Link>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    )
}