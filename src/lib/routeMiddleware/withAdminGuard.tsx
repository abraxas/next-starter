//withAdminGuard should take a nextjs page component
// and return a new component that checks if the user is an admin and redirects if not

import { redirect } from "next/navigation";
import React from "react";
import { userService } from "@services/server/users/User.service";

export default function withAdminGuard(Element: React.JSX.ElementType) {
  return async function AdminGuard(props: any) {
    await userService.redirectIfNotAdmin();
    return <Element {...props} />;
  };
}
