import { cookies } from "next/headers";
import { generateCodeVerifier, OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { google, lucia } from "@/app/lib/auth";
import { serverContainer } from "@services/serverContainer";
import { PrismaService } from "@services/server/prisma";
import { TYPES } from "@services/types";

const prismaService = serverContainer.get<PrismaService>(PrismaService);
const db = prismaService.client;

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

    console.log(1);

    let existingAccount = await db.account.findFirst({
      where: {
        provider: "google",
        providerAccountId: googleUser.sub,
      },
      include: {
        user: true,
      },
    });
    console.log(2);
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
    }
    console.log(3);
    //create user and account
    const userId = generateIdFromEntropySize(10); // 16 characters long
    console.log(4);
    const addedUser = await db.user.create({
      data: {
        id: userId,
        email: googleUser.email,
        image: googleUser.picture,
        updatedAt: new Date(),
      },
    });
    console.log(5);

    const addedAccount = await db.account.create({
      data: {
        userId: userId,
        provider: "google",
        providerAccountId: googleUser.sub,
        updatedAt: new Date(),
      },
    });

    console.log(6);
    const session = await lucia.createSession(addedUser.id.toString(), {});
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
    console.log("NOOOOOO");
    console.dir(e);
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
