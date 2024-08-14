import "reflect-metadata";

import { injectable } from "inversify";
import { PrismaService } from "@services/server/PrismaService";
import { Prisma, User, Organization } from "@prisma/client";
import ServerConfig from "@services/server/config/ServerConfig";
import { OrganizationService } from "@services/server/organizations/Organization.service";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AbilityBuilder, defineAbility, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaAbility } from "@casl/prisma";

@injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private serverConfig: ServerConfig,
    private organizationService: OrganizationService,
  ) {}

  async getUserSession() {
    return validateRequest();
  }

  async getUserById(id: string, includeSensitive?: boolean) {
    return this.prismaService.client.user.findUnique({
      where: {
        id,
      },
      include: {
        adminUser: true,
      },
    });
  }

  async getCurrentUser(includeSensitive?: boolean) {
    const session = await this.getUserSession();
    if (!session?.user?.id) return null;

    if (this.serverConfig.automaticallyCreatePersonalOrganization) {
      await this.organizationService.getPersonalOrganization(session.user.id);
    }

    return this.getUserById(session.user.id, includeSensitive);
  }

  isAdmin(user: any): boolean {
    return !!user.adminUser;
  }

  async assertCurrentUserIsAdmin(ability?: PureAbility) {
    let userAbility = ability;
    if (!userAbility) {
      userAbility = await this.getCurrentUserAbility();
    }
    if (userAbility.cannot("all", "admin")) {
      throw new Error("User is not a sysadmin");
    }
  }

  async redirectIfNotAdmin() {
    const user = await this.getCurrentUser();
    const ability = await this.getAbility(user);

    //if (!user || !this.isAdmin(user)) {
    if (ability.cannot("all", "admin")) {
      redirect("/");
    }
  }
  async getAbility(user?: User | null) {
    const { can, cannot, build } = new AbilityBuilder(createPrismaAbility);

    if (user) {
      if (this.isAdmin(user)) {
        can(["manage", "read"], "admin");
        can(["access", "read", "create", "update", "delete"], "Organization");
      }
    }

    return build();
  }

  async getCurrentUserAbility() {
    const user = await this.getCurrentUser();
    return this.getAbility(user);
  }
}
