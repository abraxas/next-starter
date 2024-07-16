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
    if (!this.isMultitenant()) {
      return [await this.getDefaultOrganization()];
    }
    return this.prismaService.client.organization.findMany();
  }

  async getOrganizationById(id: string) {
    return this.prismaService.client.organization.findUnique({
      where: { id },
    });
  }
  async getOrganizationByName(name: string) {
    return this.prismaService.client.organization.findUnique({
      where: { name },
    });
  }

  async isMultitenant() {
    return this.serverConfig.multiTenant;
  }

  async createOrganization(name: string): Promise<Organization> {
    return this.prismaService.client.organization.create({
      data: {
        id: uuidv4(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getDefaultOrganization(): Promise<Organization> {
    let defaultOrganizationName =
      this.serverConfig.defaultOrganizationName ?? "Global";
    const defaultOrganization =
      await this.prismaService.client.organization.findFirst({
        where: { name: defaultOrganizationName },
      });
    if (!defaultOrganization) {
      return this.createOrganization(defaultOrganizationName);
    }
    return defaultOrganization;
  }
}
