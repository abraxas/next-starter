import GoogleProvider from "next-auth/providers/google";
import { PrismaService } from "@services/server/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";

const prismaService = new PrismaService();
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Nodemailer({
      //server: `smtp://${process.env.EMAIL_USER}:${process.env.EMAIL_PASSWORD?.replaceAll(" ", "%20")}@${process.env.EMAIL_SERVER}:587`,
      server: {
        host: process.env.EMAIL_SERVER,
        port: 587,
        auth: {
          type: "login",
          user: process.env.EMAIL_USER!,
          pass: process.env.EMAIL_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM,

      //user: process.env.EMAIL_SERVER_USER,
      //password: process.env.EMAIL_SERVER_PASSWORD,
    }),
  ],
  adapter: PrismaAdapter(prismaService.client),
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
