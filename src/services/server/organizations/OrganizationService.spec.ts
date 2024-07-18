import "reflect-metadata";

import { Container } from "inversify";
import { OrganizationService } from "./OrganizationService";
import { PrismaService } from "@services/server/prisma";
import ServerConfig from "@services/server/config/ServerConfig";

// Mock implementations
const mockServerConfig = {
  multiTenant: true,
  defaultOrganizationName: "Default",
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
    const org = await service.createOrganization({
      name,
      slug: "neworg",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(org.name).toBe(name);
    expect(mockPrismaService.client.organization.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name }),
    });
  });

  it("should return organizations for multi-tenant", async () => {
    mockPrismaService.client.organization.findMany.mockResolvedValue([
      { id: "1", name: "Org1" },
    ]);
    const organizations = await service.getOrganizations();
    expect(organizations.length).toBeGreaterThan(0);
    expect(mockPrismaService.client.organization.findMany).toHaveBeenCalled();
  });

  it("should return default organization for single tenant", async () => {
    mockServerConfig.multiTenant = false;
    const defaultOrg = { id: "default", name: "Default" };
    mockPrismaService.client.organization.findUnique.mockResolvedValue(
      defaultOrg,
    );
    const organizations = await service.getOrganizations();
    expect(organizations).toEqual([defaultOrg]);
    mockServerConfig.multiTenant = true;
  });

  it("should find an organization by ID", async () => {
    const orgId = "testId";
    const org = { id: orgId, name: "TestOrg" };
    mockPrismaService.client.organization.findUnique.mockResolvedValue(org);
    const result = await service.getOrganizationById(orgId);
    expect(result).toEqual(org);
    expect(
      mockPrismaService.client.organization.findUnique,
    ).toHaveBeenCalledWith({ where: { id: orgId } });
  });

  it("should return null when organization by ID not found", async () => {
    mockPrismaService.client.organization.findUnique.mockResolvedValue(null);
    const result = await service.getOrganizationById("nonExistingId");
    expect(result).toBeNull();
  });

  it("should find an organization by slug", async () => {
    const orgSlug = "TestOrg";
    const org = { id: "testId", name: orgSlug, slug: orgSlug };
    mockPrismaService.client.organization.findUnique.mockResolvedValue(org);
    const result = await service.getOrganizationBySlug(orgSlug);
    expect(result).toEqual(org);
    expect(
      mockPrismaService.client.organization.findUnique,
    ).toHaveBeenCalledWith({ where: { slug: orgSlug } });
  });

  it("should return null when organization by name not found", async () => {
    mockPrismaService.client.organization.findUnique.mockResolvedValue(null);
    const result = await service.getOrganizationBySlug("nonExistingName");
    expect(result).toBeNull();
  });

  it("should get or create default organization", async () => {
    const defaultOrgSlug = "default";
    const defaultOrg = {
      id: "defaultId",
      name: defaultOrgSlug,
      slug: defaultOrgSlug,
    };
    // Simulate not found then creation
    mockPrismaService.client.organization.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(defaultOrg);
    mockPrismaService.client.organization.create.mockResolvedValue(defaultOrg);
    const result = await service.getDefaultOrganization();
    expect(result).toEqual(defaultOrg);
    expect(mockPrismaService.client.organization.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ slug: defaultOrgSlug }),
    });
  });
});
