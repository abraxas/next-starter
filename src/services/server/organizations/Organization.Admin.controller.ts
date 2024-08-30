import "reflect-metadata";

import { Prisma } from "@prisma/client";
import { organizationService } from "@services/server/organizations/Organization.service";
import { userService } from "@services/server/users/User.service";

export class OrganizationAdminController {
  private organizationService: typeof organizationService;
  private userService: typeof userService;

  constructor() {
    this.userService = userService;
    this.organizationService = organizationService;
  }

  async getOrganizations({ showArchived }: { showArchived?: boolean } = {}) {
    const ability = await this.userService.getCurrentUserAbility();
    await this.userService.assertCurrentUserIsAdmin(ability);
    return this.organizationService.getOrganizations({ showArchived, ability });
  }

  async getOrganizationById(id: string) {
    await this.userService.assertCurrentUserIsAdmin();
    return this.organizationService.getOrganizationById(id);
  }

  async updateOrganization(id: string, data: Prisma.OrganizationUpdateInput) {
    await this.userService.assertCurrentUserIsAdmin();
    return this.organizationService.updateOrganization(id, data);
  }

  async createOrganization(data: Prisma.OrganizationCreateInput) {
    await this.userService.assertCurrentUserIsAdmin();
    return this.organizationService.createOrganization(data);
  }

  async archiveOrganization(id: string) {
    await this.userService.assertCurrentUserIsAdmin();
    return this.organizationService.archiveOrganization(id);
  }
}
export const organizationAdminController = new OrganizationAdminController();
