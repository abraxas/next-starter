import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode, decode } from "next-auth/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const adapter = PrismaAdapter(prisma);

const session = {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};

export const authOptions = (req: any, res: any) => {
  return {
    providers: [
      Google,
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "email", type: "text" },
          password: { label: "password", type: "password" },
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          //const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
          let user = await prisma.user.findFirst({
            where: {
              email: credentials.email ?? "",
            },
          });

          if (credentials.password != "test") return null;

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        },
      }),
    ],

    callbacks: {
      // session({ session, user }: any) {
      //   if (session.user) {
      //     session.user.id = user.id;
      //   }
      //   return session;
      // },
      // async signIn({ user, credentials }: any) {
      //   if (!credentials) return true;
      //
      //   if (credentials) {
      //     if (user && "id" in user) {
      //       const sessionToken = uuid();
      //       const sessionExpiry = new Date(Date.now() + session.maxAge * 1000);
      //       // @ts-ignore
      //       await adapter.createSession({
      //         sessionToken: sessionToken,
      //         userId: user.id,
      //         expires: sessionExpiry,
      //       });
      //       const cookieStore = cookies();
      //       cookieStore.set("authjs.session-token", sessionToken, {
      //         expires: sessionExpiry,
      //       });
      //     }
      //   }
      //   return true;
      // },
    },

    //needs to override default jwt behavior when using Credentials
    // jwt: {
    //   encode(params: any) {
    //     if (
    //       req.nextUrl?.pathname?.includes("callback") &&
    //       req.nextUrl?.pathname?.includes("credentials") &&
    //       req.method === "POST"
    //     ) {
    //       const cookieStore = cookies();
    //
    //       const cookie = cookieStore.get("next-auth.session-token");
    //       if (cookie) return cookie;
    //       else return "";
    //     }
    //     // Revert to default behaviour when not in the credentials provider callback flow
    //     return encode(params);
    //   },
    //   async decode(params: any) {
    //     if (
    //       req.nextUrl?.pathname?.includes("callback") &&
    //       req.nextUrl?.pathname?.includes("credentials") &&
    //       req.method === "POST"
    //     ) {
    //       return null;
    //     }
    //     // Revert to default behaviour when not in the credentials provider callback flow
    //     return decode(params);
    //   },
    // },
    adapter,
    session,
    secret: 'i have a secret'
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions as any);
