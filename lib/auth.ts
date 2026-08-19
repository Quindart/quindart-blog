import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (e) {
    throw new Error("Unauthorized");
  }
}
