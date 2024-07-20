import "reflect-metadata";

import { injectable } from "inversify";
import ServerConfig from "@services/server/config/ServerConfig";
import { PrismaService } from "@services/server/prisma";
import { Prisma, Organization } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class OrganizationService {
  constructor(
    private serverConfig: ServerConfig,
    private prismaService: PrismaService,
  ) {}

  async getOrganizations({
    showArchived = false,
  }: {
    showArchived?: boolean;
  } = {}): Promise<Organization[]> {
    if (!this.isMultiTenant()) {
      return [await this.getDefaultOrganization()];
    }
    const organizations = await this.prismaService.client.organization.findMany(
      {
        where: {
          ...(showArchived ? {} : { archived: false }),
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
}
