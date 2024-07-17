import "reflect-metadata";

import { inject, injectable } from "inversify";
import { OrganizationService } from "@services/server/organizations/OrganizationService";
import { UserService } from "@services/server/users/UserService";
import { Prisma } from "@prisma/client";

@injectable()
export class OrganizationController {
  constructor(
    private organizationService: OrganizationService,
    private userService: UserService,
  ) {}

  async getOrganizations() {
    await this.userService.assertCurrentUserIsAdmin();

    return this.organizationService.getOrganizations();
  }

  async getOrganizationById(id: string) {
    await this.userService.assertCurrentUserIsAdmin();

    return this.organizationService.getOrganizationById(id);
  }

  async updateOrganization(id: string, data: Prisma.OrganizationUpdateInput) {
    await this.userService.assertCurrentUserIsAdmin();

    return this.organizationService.updateOrganization(id, data);
  }
}
