import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  await logout();
  revalidatePath("/(web)", "layout");
  revalidateTag("session");
  redirect("/");
}
