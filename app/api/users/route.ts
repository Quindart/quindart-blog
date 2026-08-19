import { createUser, getAllUsers } from "@/lib/services/user.service";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const users = await getAllUsers();
  return Response.json(users);
}

export async function POST(request: Request) {
  try {
    requireAuth();
  } catch (e) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const user = await createUser(body);
  return Response.json(user);
}
