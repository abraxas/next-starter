"use server";

import { inversifyServerContainer } from "@services/inversifyServerContainer";
import { UserService } from "@services/server/users/User.service";
import { redirect } from "next/navigation";
import ProfileComponent from "@/app/(web)/profile/components/ProfileComponent";
import { Box, Container, Heading } from "@chakra-ui/react";
import ProfileModal from "@/app/(web)/profile/components/ProfileModal";

export default async function ProfilePage() {
  const userService = inversifyServerContainer.get(UserService);
  const user = await userService.getCurrentUser();

  const onClose = () => {};
  const onSave = () => {};

  if (!user) {
    redirect("/");
  }

  return (
    <Box maxW="xl">
      <Heading>User Profile</Heading>
      <ProfileComponent user={user} />
    </Box>
  );
}
