import "reflect-metadata";

import { inject, injectable } from "inversify";
import ServerConfig from "@services/server/config/ServerConfig";
import {
  prismaService,
  type PrismaService,
} from "@services/server/PrismaService";
import { Prisma, Organization } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { TYPES } from "@services/types";
import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { PureAbility } from "@casl/ability";
import { accessibleBy, PrismaQuery } from "@casl/prisma";

@injectable()
export class OrganizationService {
  private prismaService: PrismaService;
  constructor(
    private serverConfig: ServerConfig,
    @inject(TYPES.Cookies) private cookies: ReadonlyRequestCookies,
  ) {
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
      abilityFilters.push(accessibleBy(ability).Organization);
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

  async getPersonalOrganization(userId: string) {
    const personalOrganizationName =
      this.serverConfig.personalOrganizationName ?? "Personal";
    const personalOrganizationSlug = userId;
    const personalOrganization =
      await this.prismaService.client.organization.findUnique({
        where: { slug: personalOrganizationSlug },
      });
    if (!personalOrganization) {
      return this.createOrganization({
        name: personalOrganizationName,
        slug: personalOrganizationSlug,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return personalOrganization;
  }

  async getCurrentOrganization() {
    const organizationId = this.cookies.get("organizationId");
    if (!organizationId?.value) return undefined;
    return this.getOrganizationById(organizationId.value);
  }

  async setCurrentOrganization(organizationId: string) {
    this.cookies.set("organizationId", organizationId);
  }
}
