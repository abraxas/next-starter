import "reflect-metadata";

import { injectable } from "inversify";
import { z } from "zod";
import ClientConfig from "@services/client/config/ClientConfig";

const ServerConfigSchema = z.object({
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),

  EMAIL_FROM: z.string().optional(),
  EMAIL_SERVER: z.string().optional(),
  EMAIL_PORT: z.number().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
});

export class ServerConfig extends ClientConfig {
  databaseUrl?: string;
  authSecret: string;

  email?: {
    from?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
  };

  public constructor() {
    super();
    const config = ServerConfigSchema.parse(process.env);
    this.databaseUrl = config.DATABASE_URL;
    this.authSecret = config.AUTH_SECRET;

    if (config.EMAIL_FROM) {
      this.email = {
        from: config.EMAIL_FROM,
        host: config.EMAIL_SERVER,
        port: config.EMAIL_PORT,
        user: config.EMAIL_USER,
        password: config.EMAIL_PASSWORD,
      };
    }
  }
}

export const serverConfig = new ServerConfig();
