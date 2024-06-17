// app/login/github/callback/route.ts
import { cookies } from "next/headers";
import { generateCodeVerifier, OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { google, lucia } from "@/app/lib/auth";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { account, user } from "@/drizzle/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const codeVerifier = cookies().get("code_verifier")?.value ?? "";

  const storedState = cookies().get("google_auth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    let existingAccount:
      | { userId?: string; user?: { id: string } }
      | undefined = await db.query.account
      .findFirst({
        where: and(
          eq(account.provider, "google"),
          eq(account.providerAccountId, googleUser.sub),
        ),
        with: {
          user: true,
        },
      })
      .execute();
    let existingUser: { id: string };

    if (existingAccount?.user) {
      const existingUser = existingAccount.user;
      const session = await lucia.createSession(existingUser!.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
      // }
    }

    //create user and account
    const userId = generateIdFromEntropySize(10); // 16 characters long

    existingUser = (
      await db
        .insert(user)
        .values({
          id: userId,
          email: googleUser.email,
          image: googleUser.picture,
          updatedAt: new Date(),
        })
        .returning()
    )[0];

    existingAccount = (
      await db
        .insert(account)
        .values({
          userId: userId,
          provider: "google",
          providerAccountId: googleUser.sub,
          updatedAt: new Date(),
        })
        .returning()
    )[0];

    const session = await lucia.createSession(existingUser.id.toString(), {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}
