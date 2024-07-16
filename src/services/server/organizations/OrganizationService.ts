import { injectable } from "inversify";
import ServerConfig from "@/services/server/config/ServerConfig";
import { PrismaService } from "@/services/server/prisma";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class OrganizationService {
  constructor(
    private serverConfig: ServerConfig,
    private prismaService: PrismaService,
  ) {}

  async getOrganizations() {
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

  async createOrganization(name: string) {
    return this.prismaService.client.organization.create({
      data: {
        id: uuidv4(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getDefaultOrganization() {
    if (!this.serverConfig.defaultOrganizationName) {
      return undefined;
    }
    const defaultOrganization =
      await this.prismaService.client.organization.findFirst({
        where: { name: this.serverConfig.defaultOrganizationName },
      });
    if (!defaultOrganization) {
      return this.createOrganization(this.serverConfig.defaultOrganizationName);
    }
    return defaultOrganization;
  }
}
