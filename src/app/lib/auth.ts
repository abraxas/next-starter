import { Lucia, Session, User } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db, pool } from "../../drizzle/db";
import { cookies } from "next/headers";
import { cache } from "react";
import { Google } from "arctic";

import { session, user } from "@/drizzle/schema";
import { SessionSelectModel, UserSelectModel } from "@/drizzle/types";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { revalidatePath } from "next/cache";

// import { webcrypto } from "crypto";
// globalThis.crypto = webcrypto as Crypto;

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);
// const adapter = new NodePostgresAdapter(pool, {
//     user: "user",
//     session: "session"
// });
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      image: attributes.image,
      //fnord: attributes,
    };
  },
});

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!,
);

// export const googleAuth = google(lucia, {
//     clientId: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     redirectUri: process.env.GOOGLE_REDIRECT_URI!,
// });

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export const logout = async () => {
  lucia.invalidateSession(cookies().get(lucia.sessionCookieName)?.value!);
  cookies().delete(lucia.sessionCookieName);
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<typeof user, "id">;
  }
}
