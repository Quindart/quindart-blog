import { getUserById, updateUser, deleteUser } from "@/lib/services/user.service";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const user = await getUserById(Number(params.id));
    return Response.json(user);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const body = await request.json();
    const user = await updateUser(Number(params.id), body);
    return Response.json(user);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await deleteUser(Number(params.id));
    return Response.json({ message: "User deleted successfully" });
}
