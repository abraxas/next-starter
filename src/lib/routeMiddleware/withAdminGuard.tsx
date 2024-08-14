//withAdminGuard should take a nextjs page component
// and return a new component that checks if the user is an admin and redirects if not

import { redirect } from "next/navigation";
import { serverContainer } from "@services/serverContainer";
import { UserService } from "@services/server/users/User.service";
import React from "react";

export default function withAdminGuard(Element: React.JSX.ElementType) {
  return async function AdminGuard(props: any) {
    const userService = serverContainer.get(UserService);
    await userService.redirectIfNotAdmin();
    return <Element {...props} />;
  };
}
