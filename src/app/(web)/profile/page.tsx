"use server";

import { redirect } from "next/navigation";
import ProfileComponent from "@/app/(web)/profile/components/ProfileComponent";
import { Box, Container, Heading } from "@chakra-ui/react";
import { userService } from "@services/server/users/User.service";

export default async function ProfilePage() {
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
