import {
  OrganizationService,
  organizationService,
} from "@services/server/organizations/Organization.service";
import { userService } from "@services/server/users/User.service";
import { subject } from "@casl/ability";
import { prismaService, PrismaService } from "@services/server/PrismaService";
import { Organization, User } from "@prisma/client";

export class OrganizationController {
  private organizationService: typeof organizationService;
  private userService: typeof userService;
  private prismaService: PrismaService;

  constructor() {
    this.userService = userService;
    this.organizationService = OrganizationService.instance;
    this.prismaService = prismaService;
  }

  async getAvailableOrganizations() {
    const ability = await this.userService.getCurrentUserAbility(false);
    return this.organizationService.getOrganizations({ ability });
  }

  async getCurrentOrganization(): Promise<Organization | null> {
    const sessionData = await this.userService.getUserSession();
    if (!sessionData.user || !sessionData.session) return null;

    const organizationId = sessionData.session.organizationId;

    if (organizationId) {
      const selectedOrganization =
        await this.organizationService.getOrganizationById(organizationId);
      const ability = await this.userService.getCurrentUserAbility(false);
      if (!ability) throw new Error("No ability found");
      if (
        ability.cannot("read", subject("Organization", selectedOrganization))
      ) {
        await this.setCurrentOrganization(null);
        return this.getCurrentOrganization();
      }
      if (selectedOrganization) return selectedOrganization;
    }

    const personalOrganization =
      await this.organizationService.getPersonalOrganization(sessionData.user);
    if (personalOrganization) {
      await this.setCurrentOrganization(personalOrganization.id);

      return personalOrganization;
    }
    const organizations = await this.getAvailableOrganizations();
    if (organizations.length) {
      await this.setCurrentOrganization(organizations[0].id);
      return organizations[0];
    }
    return null;
  }

  async setCurrentOrganization(organizationId: string | null) {
    const sessionData = await this.userService.getUserSession();
    if (sessionData.session?.organizationId !== organizationId) {
      await this.prismaService.client.session.update({
        where: { id: sessionData.session?.id },
        data: { organizationId },
      });
    }
  }
}

export const organizationController = new OrganizationController();
