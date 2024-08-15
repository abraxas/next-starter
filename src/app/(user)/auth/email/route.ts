import { serverContainer } from "@services/serverContainer";
import { PrismaService } from "@services/server/PrismaService";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { z } from "zod";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import ServerConfig from "@services/server/config/ServerConfig";

async function generateEmailCode(email: string, accountId?: string) {
  const prismaService = serverContainer.get<PrismaService>(PrismaService);
  await prismaService.client.emailCode.deleteMany({
    where: {
      email: accountId ? undefined : email,
    },
  });

  const code = generateRandomString(8, alphabet("0-9"));
  return await prismaService.client.emailCode.create({
    data: {
      accountId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(15, "m")),
    },
  });
}

async function sendCodeEmail(email: string, code: string) {
  const config = serverContainer.get<ServerConfig>(ServerConfig);

  // send email using nodemailer
  console.log(`Sending code ${code} to ${email}`);
  const subject = "Your code";
  const text = `Your code is ${code}`;

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
export default async function POST(request: Request): Promise<Response> {
  const rawData = await request.json();
  const data = BodySchema.parse(rawData);

  const { email, accountId } = data;

  if (!email) {
    return new Response(null, {
      status: 400,
    });
  }

  const code = await generateEmailCode(email, accountId);
  await sendCodeEmail(email, code.code);
  redirect("/auth/email/code?email=" + email);
}
