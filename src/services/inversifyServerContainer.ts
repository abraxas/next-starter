import "reflect-metadata";

import { Container } from "inversify";
import { clientContainer } from "@services/clientContainer";
import { TYPES } from "@services/types";
import { OrganizationService } from "@services/server/organizations/Organization.service";
import { UserService } from "@services/server/users/User.service";
import { UserController } from "@services/server/users/User.controller";
import { OrganizationController } from "@services/server/organizations/Organization.controller";
import { cookies } from "next/headers";
import { JwtClaimsService } from "@services/server/JwtClaims/JwtClaims.service";

export const inversifyServerContainer = Container.merge(
  clientContainer,
  new Container(),
);

inversifyServerContainer.bind(OrganizationController).toSelf();
inversifyServerContainer.bind(UserController).toSelf();
inversifyServerContainer.bind(JwtClaimsService).toSelf();

inversifyServerContainer.bind(TYPES.Cookies).toDynamicValue(() => cookies());

//export { inversifyServerContainer };
