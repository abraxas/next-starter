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

  async getOrganizations(): Promise<Organization[]> {
    if (!this.isMultiTenant()) {
      return [await this.getDefaultOrganization()];
    }
    const organizations =
      await this.prismaService.client.organization.findMany();
    if (!organizations.length) {
      return [await this.getDefaultOrganization()];
    }
    return organizations;
  }

  async getOrganizationById(id: string) {
    if (!this.isMultiTenant()) return this.getDefaultOrganization();
    return this.prismaService.client.organization.findUnique({
      where: { id },
    });
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
}
