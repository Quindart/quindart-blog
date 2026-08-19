import { redirect } from "next/navigation";

export default function AdminLoginRedirect() {
  // Redirect legacy-looking path /admin/login to the actual dashboard login
  redirect("/dashboard/login");
}
