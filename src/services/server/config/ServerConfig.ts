import "reflect-metadata";

import { injectable } from "inversify";
import { z } from "zod";
import ClientConfig from "@services/client/config/ClientConfig";

const ServerConfigSchema = z.object({
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
});

@injectable()
export default class ServerConfig extends ClientConfig {
  databaseUrl?: string;

  public constructor() {
    super();
    const config = ServerConfigSchema.parse(process.env);
    this.databaseUrl = config.DATABASE_URL;
  }
}

export { ServerConfig };
