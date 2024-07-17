"use server";

import { cookies } from "next/headers";
import { logout, lucia } from "@/lib/auth";

export async function logoutAction() {
  logout();
}
