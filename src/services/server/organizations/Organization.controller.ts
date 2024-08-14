import "reflect-metadata";

import { injectable } from "inversify";
import { OrganizationService } from "@services/server/organizations/Organization.service";
import { UserService } from "@services/server/users/User.service";
import { Prisma } from "@prisma/client";

@injectable()
export class OrganizationController {
  constructor(
    private organizationService: OrganizationService,
    private userService: UserService,
  ) {}

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
