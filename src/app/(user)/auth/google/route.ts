import { cookies } from "next/headers";
import {google} from "@/app/lib/auth";
import { generateState, generateCodeVerifier } from "arctic";

export async function GET(): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("google_auth_state", state, {
        secure: true, // set to false in localhost
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10 // 10 min
    });
    cookies().set("code_verifier", codeVerifier, {
        secure: true, // set to false in localhost
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10 // 10 min
    });

    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["email", "profile"],
    });

    return Response.redirect(url);
}