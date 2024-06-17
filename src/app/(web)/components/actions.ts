"use server";

import { cookies } from "next/headers";
import { logout, lucia } from "@/app/lib/auth";

export async function logoutAction() {
  logout();
}
