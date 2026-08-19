import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/services/user.service";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUserById(Number(params.id));
  return Response.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    requireAuth();
  } catch (e) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const user = await updateUser(Number(params.id), body);
  return Response.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    requireAuth();
  } catch (e) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteUser(Number(params.id));
  return Response.json({ message: "User deleted successfully" });
}
