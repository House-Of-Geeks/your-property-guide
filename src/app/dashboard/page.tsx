import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role === "admin") redirect("/dashboard/admin");
  redirect("/dashboard/profile");
}
