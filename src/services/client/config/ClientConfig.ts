import "reflect-metadata";

import { injectable } from "inversify";
import { z } from "zod";

const ConfigSchema = z.object({
  NEXT_PUBLIC_AUTH_CREDENTIALS: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  NEXT_PUBLIC_AUTH_AUTO_REDIRECT: z.string().optional(),
  NEXT_PUBLIC_MULTITENANT: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  NEXT_PUBLIC_DEFAULT_ORGANIZATION: z.string().optional(),
});

@injectable()
export default class ClientConfig {
  authCredentials?: boolean;
  authAutoRedirect?: string;
  multiTenant?: boolean;
  defaultOrganizationSlug?: string;

  public constructor() {
    const config = ConfigSchema.parse(process.env);
    this.authCredentials = config.NEXT_PUBLIC_AUTH_CREDENTIALS;
    this.authAutoRedirect = config.NEXT_PUBLIC_AUTH_AUTO_REDIRECT;
    this.multiTenant = config.NEXT_PUBLIC_MULTITENANT;
    this.defaultOrganizationSlug = config.NEXT_PUBLIC_DEFAULT_ORGANIZATION;
  }
}
