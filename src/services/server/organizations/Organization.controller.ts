import {
  OrganizationService,
  organizationService,
} from "@services/server/organizations/Organization.service";
import { userService } from "@services/server/users/User.service";
import {
  ICookiesProvider,
  readonlyCookiesProvider,
} from "@services/server/cookies/Cookies.provider";

type OrganizationDependencies = {
  cookieProvider: ICookiesProvider;
};

export class OrganizationController {
  private organizationService: typeof organizationService;
  private userService: typeof userService;
  private cookies: ICookiesProvider;

  constructor(deps?: OrganizationDependencies) {
    this.userService = userService;
    this.organizationService = OrganizationService.instance;
    this.cookies = deps?.cookieProvider ?? readonlyCookiesProvider;
  }

  async getAvailableOrganizations() {
    const ability = await this.userService.getCurrentUserAbility(false);
    return this.organizationService.getOrganizations({ ability });
  }

  async getCurrentOrganization() {
    console.log("GCO");
    let user: any;
    console.log({ this: this });
    try {
      user = await this.userService.getCurrentUser();
    } catch (e) {
      console.log({ error: e });
      throw e;
    }
    console.log({ user });
    if (!user) return undefined;
    console.log("USE ME");

    const organizationId = this.cookies.get("organizationId");

    console.log({ organizationId });

    if (organizationId) {
      const selectedOrganization =
        await this.organizationService.getOrganizationById(organizationId);
      if (selectedOrganization) return selectedOrganization;
    }
    console.log("123");

    const personalOrganization =
      await this.organizationService.getPersonalOrganization(user);
    if (personalOrganization) {
      await this.setCurrentOrganization(personalOrganization.id);
      return personalOrganization;
    }
    console.log("321");
    const organizations = await this.getAvailableOrganizations();
    console.log({ organizations });
    if (organizations.length) {
      console.log("DUH");
      await this.setCurrentOrganization(organizations[0].id);
      console.log("ANDRETURN");
      return organizations[0];
    }
    return null;
  }

  async setCurrentOrganization(organizationId: string) {
    if (this.cookies.canSet) {
      this.cookies.set("organizationId", organizationId);
    }
  }
}

export const organizationController = new OrganizationController();
