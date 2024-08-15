"use server";

import { ActionResult } from "next/dist/server/app-render/types";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverContainer } from "@services/serverContainer";
import { PrismaService } from "@services/server/PrismaService";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { createDate, TimeSpan } from "oslo";
import ServerConfig from "@services/server/config/ServerConfig";
import nodemailer from "nodemailer";
import { alphabet, generateRandomString } from "oslo/crypto";

export async function login(
  foo: any,
): Promise<ActionResult & { error?: string }> {
  const prismaService = serverContainer.get<PrismaService>(PrismaService);
  const db = prismaService.client;

  const email = foo.get("email");
  const password = foo.get("password");

  const username = email;

  const existingUser = await db.user.findFirst({
    where: {
      email: username,
    },
  });

  if (!existingUser) {
    return {
      error: "Incorrect email or password",
    };
  }
  const validPassword = true;
  if (!validPassword) {
    return {
      error: "Incorrect email or password",
    };
  }

  const session = await lucia.createSession(existingUser?.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

async function generateEmailCode(
  email: string,
  accountId?: string,
): Promise<string> {
  const prismaService = serverContainer.get<PrismaService>(PrismaService);
  await prismaService.client.emailCode.deleteMany({
    where: {
      email: accountId ? undefined : email,
    },
  });

  const code = generateRandomString(6, alphabet("0-9"));
  await prismaService.client.emailCode.create({
    data: {
      accountId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(15, "m")),
    },
  });
  return code;
}

async function sendCodeEmail(email: string, code: string) {
  const config = serverContainer.get<ServerConfig>(ServerConfig);

  // send email using nodemailer
  console.log(`Sending code ${code} to ${email}`);
  const subject = "Your code";
  const text = `Your code is ${code}`;

  console.log({
    transport: {
      host: config.email?.host,
      port: 587,
      secure: false,
      auth: {
        user: config.email?.user,
        pass: config.email?.password,
      },
    },
    mailOptions: {
      from: config.email?.from,
      to: email,
      subject,
      text,
    },
  });

  const transporter = nodemailer.createTransport({
    host: config.email?.host,
    port: 587,
    secure: false,
    auth: {
      user: config.email?.user,
      pass: config.email?.password,
    },
  });

  const mailOptions = {
    from: config.email?.from,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const BodySchema = z.object({
  email: z.string().email(),
  accountId: z.string().optional(),
});

export const codeAction = actionClient
  .schema(
    z.object({ email: z.string().email(), accountId: z.string().optional() }),
  )
  //.bindArgsSchemas<BodySchema>([BodySchema])
  .action(async ({ parsedInput: { email, accountId } }) => {
    console.log("BAH");
    if (!email) {
      return new Response(null, {
        status: 400,
      });
    }
    console.log("REM");

    const code = await generateEmailCode(email, accountId);
    await sendCodeEmail(email, code);
    //redirect("/auth/email/code");
    return { success: true };
  });
