import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
  "use cache: private";
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return session?.user;
}

export async function requireAdmin() {
  "use cache: private";
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
