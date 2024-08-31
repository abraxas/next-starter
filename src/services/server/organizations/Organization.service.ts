import "reflect-metadata";

import {
  prismaService,
  type PrismaService,
} from "@services/server/PrismaService";
import { Prisma, Organization, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { PureAbility } from "@casl/ability";
import { accessibleBy, PrismaQuery } from "@casl/prisma";
import { serverConfig } from "@services/server/config/ServerConfig";
import { Memoize } from "typescript-memoize";
import { Singleton } from "@/lib/decorators/scope_decorators";

@Singleton
export class OrganizationService {
  @Memoize()
  public static get instance() {
    return new OrganizationService();
  }

  private serverConfig: typeof serverConfig;
  private prismaService: PrismaService;

  constructor() {
    this.serverConfig = serverConfig;
    this.prismaService = prismaService;
  }

  async getOrganizations({
    showArchived = false,
    ability,
  }: {
    showArchived?: boolean;
    ability?: PureAbility<any, PrismaQuery>;
  } = {}): Promise<Organization[]> {
    if (!this.isMultiTenant()) {
      return [await this.getDefaultOrganization()];
    }

    const abilityFilters = [];

    if (ability) {
      if (ability.can("read", "Organization")) {
        abilityFilters.push(accessibleBy(ability).Organization);
      } else {
        return [];
      }
    }

    const organizations = await this.prismaService.client.organization.findMany(
      {
        where: {
          AND: [...abilityFilters, showArchived ? {} : { archived: false }],
        },
      },
    );

    if (!organizations.length) {
      return [await this.getDefaultOrganization()];
    }
    return organizations;
  }

  async getOrganizationById(id: string): Promise<Organization> {
    if (!this.isMultiTenant()) return this.getDefaultOrganization();
    return this.prismaService.client.organization.findUnique({
      where: { id },
    }) as Promise<Organization>;
  }
  async getOrganizationBySlug(slug: string) {
    if (!this.isMultiTenant()) return this.getDefaultOrganization();
    return this.prismaService.client.organization.findUnique({
      where: { slug },
    });
  }

  isMultiTenant() {
    return this.serverConfig.multiTenant;
  }

  async createOrganization(
    data: Prisma.OrganizationCreateInput,
  ): Promise<Organization> {
    const { createdAt, updatedAt, ...rest } = data;
    return this.prismaService.client.organization.create({
      data: {
        id: uuidv4(),
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date(),
        ...rest,
      },
    });
  }

  async updateOrganization(id: string, data: Prisma.OrganizationUpdateInput) {
    return this.prismaService.client.organization.update({
      where: { id },
      data,
    });
  }

  async archiveOrganization(id: string) {
    return this.prismaService.client.organization.update({
      where: { id },
      data: { archived: true, updatedAt: new Date() },
    });
  }

  async getDefaultOrganization(): Promise<Organization> {
    let defaultOrganizationSlug =
      this.serverConfig.defaultOrganizationSlug ?? "default";
    const defaultOrganization =
      await this.prismaService.client.organization.findUnique({
        where: { slug: defaultOrganizationSlug },
      });
    if (!defaultOrganization) {
      return this.createOrganization({
        name: defaultOrganizationSlug,
        slug: defaultOrganizationSlug,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return defaultOrganization;
  }

  async getPersonalOrganization(user: User) {
    const userId = user.id;
    const personalOrganizationName =
      this.serverConfig.personalOrganizationName ?? "Personal";
    const personalOrganizationSlug = `Personal_${userId}`;
    const personalOrganization =
      await this.prismaService.client.organization.findUnique({
        where: { slug: personalOrganizationSlug },
      });
    if (!personalOrganization) {
      if (serverConfig.automaticallyCreatePersonalOrganization) {
        return this.createOrganization({
          name: personalOrganizationName,
          slug: personalOrganizationSlug,
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationUsers: {
            create: {
              userId,
              role: "owner",
              name: user.name,
            },
          },
        });
      }
      return null;
    }
    return personalOrganization;
  }
}

export const organizationService = new OrganizationService();
