import "reflect-metadata";

import { injectable } from "inversify";
import { prismaService } from "@services/server/PrismaService";
import { Prisma, User, Organization } from "@prisma/client";
import { serverConfig } from "@services/server/config/ServerConfig";
import { organizationService } from "@services/server/organizations/Organization.service";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AbilityBuilder, defineAbility, PureAbility } from "@casl/ability";
import { createPrismaAbility } from "@casl/prisma";

export class UserService {
  private serverConfig: typeof serverConfig;
  private organizationService: typeof organizationService;
  constructor() {
    this.serverConfig = serverConfig;
    this.organizationService = organizationService;
  }

  async getUserSession() {
    return validateRequest();
  }

  async getUserById(id: string, includeSensitive?: boolean) {
    return prismaService.client.user.findUnique({
      where: {
        id,
      },
      include: {
        adminUser: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return prismaService.client.user.findUnique({
      where: {
        email,
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

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return prismaService.client.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return prismaService.client.user.create({
      data,
    });
  }

  async updateCurrentUser(data: Prisma.UserUpdateInput) {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    return this.updateUser(user.id, data);
  }
}

export const userService = new UserService();
