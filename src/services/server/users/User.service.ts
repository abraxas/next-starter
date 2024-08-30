import { prismaService } from "@services/server/PrismaService";
import { Prisma, User, Organization } from "@prisma/client";
import { serverConfig } from "@services/server/config/ServerConfig";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  AbilityBuilder,
  defineAbility,
  PureAbility,
  subject,
} from "@casl/ability";
import { PrismaQuery, Subjects } from "@casl/prisma";
import { createPrismaAbility } from "@casl/prisma";
import { Memoize } from "typescript-memoize";

type AppAbility = PureAbility<
  [
    string,
    (
      | Subjects<{
          Organization: Organization;
          User: User;
        }>
      | "admin"
    ),
  ],
  PrismaQuery
>;

export class UserService {
  @Memoize()
  public static get instance() {
    return new UserService();
  }

  private serverConfig: typeof serverConfig;
  constructor() {
    this.serverConfig = serverConfig;
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
  async getAbility(user?: User | null, getAdminAbilities = true) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user) {
      if (getAdminAbilities && this.isAdmin(user)) {
        can(["manage", "read"], "admin");
        can(["access", "read", "create", "update", "delete"], "Organization");
      }

      //ok, we need all the UserOrganizations for this user so we can add abilities for it
      const userOrganizations =
        await prismaService.client.organizationUser.findMany({
          where: {
            userId: user.id,
          },
          include: {
            organization: true,
          },
        });
      for (const userOrganization of userOrganizations) {
        if (
          userOrganization.role === "admin" ||
          userOrganization.role === "owner"
        ) {
          can(
            ["access", "read", "create", "update", "delete"],
            "Organization",
            {
              id: userOrganization.organization.id,
            },
          );
        } else if (userOrganization.role === "member") {
          can(["access", "read"], "Organization", {
            id: userOrganization.organizationId,
          });
        }
      }
    }

    return build();
  }

  async getCurrentUserAbility(getAdminAbilities = true) {
    const user = await this.getCurrentUser();
    return this.getAbility(user, getAdminAbilities);
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
