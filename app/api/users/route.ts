import { createUser, getAllUsers } from "@/lib/services/user.service";

export async function GET() {
    const users = await getAllUsers();
    return Response.json(users);
}

export async function POST(request: Request) {
    const body = await request.json();
    const user = await createUser(body);
    return Response.json(user);
}
