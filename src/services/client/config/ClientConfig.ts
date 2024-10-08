import "reflect-metadata";

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
  NEXT_PUBLIC_PERSONAL_ORGANIZATION_NAME: z.string().optional(),
  NEXT_PUBLIC_PERSONAL_ORGANIZATION_AUTOMATIC: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

export default class ClientConfig {
  authCredentials?: boolean;
  authAutoRedirect?: string;
  multiTenant?: boolean;
  defaultOrganizationSlug?: string;
  personalOrganizationName?: string;
  automaticallyCreatePersonalOrganization?: boolean;

  public constructor() {
    const config = ConfigSchema.parse(process.env);
    this.authCredentials = config.NEXT_PUBLIC_AUTH_CREDENTIALS;
    this.authAutoRedirect = config.NEXT_PUBLIC_AUTH_AUTO_REDIRECT;
    this.multiTenant = config.NEXT_PUBLIC_MULTITENANT;
    this.defaultOrganizationSlug = config.NEXT_PUBLIC_DEFAULT_ORGANIZATION;
    this.personalOrganizationName =
      config.NEXT_PUBLIC_PERSONAL_ORGANIZATION_NAME;
    this.automaticallyCreatePersonalOrganization =
      config.NEXT_PUBLIC_PERSONAL_ORGANIZATION_AUTOMATIC;
  }
}
