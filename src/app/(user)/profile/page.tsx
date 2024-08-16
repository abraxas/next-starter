"use server";

import { serverContainer } from "@services/serverContainer";
import { UserService } from "@services/server/users/User.service";
import { redirect } from "next/navigation";
import ProfileComponent from "@/app/(user)/profile/components/ProfileComponent";

export default async function ProfilePage() {
  const userService = serverContainer.get(UserService);
  const user = await userService.getCurrentUser();

  const onClose = () => {};
  const onSave = () => {};

  if (!user) {
    redirect("/");
  }

  return <ProfileComponent user={user} />;
}
