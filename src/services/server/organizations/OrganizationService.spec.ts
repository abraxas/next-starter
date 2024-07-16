import "reflect-metadata";

import { Container } from "inversify";
import { OrganizationService } from "./OrganizationService";
import { PrismaService } from "@/services/server/prisma";
import ServerConfig from "@/services/server/config/ServerConfig";

// Mock implementations
const mockServerConfig = {
  multiTenant: true,
  defaultOrganizationName: "DefaultOrg",
};
const mockPrismaService = {
  client: {
    organization: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve(data)),
    },
  },
};

// Set up container for testing
const container = new Container();
container
  .bind<ServerConfig>(ServerConfig)
  .toConstantValue(mockServerConfig as any);
container
  .bind<PrismaService>(PrismaService)
  .toConstantValue(mockPrismaService as any);
container
  .bind<OrganizationService>(OrganizationService)
  .to(OrganizationService);

describe("OrganizationService", () => {
  let service: OrganizationService;

  beforeEach(() => {
    service = container.get(OrganizationService);
  });

  it("should create an organization", async () => {
    const name = "NewOrg";
    const org = await service.createOrganization(name);
    expect(org.name).toBe(name);
    expect(mockPrismaService.client.organization.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name }),
    });
  });

  // Additional tests would follow a similar structure
});
