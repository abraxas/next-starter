import "reflect-metadata";

import { Container } from "inversify";
import ClientConfig from "@services/client/config/ClientConfig";
import { clientContainer } from "@services/clientContainer";
import ServerConfig from "@services/server/config/ServerConfig";
import { TYPES } from "@services/types";
import { PrismaService } from "@services/server/PrismaService";
import { OrganizationService } from "@services/server/organizations/Organization.service";
import { UserService } from "@services/server/users/User.service";
import { UserController } from "@services/server/users/User.controller";
import { OrganizationController } from "@services/server/organizations/Organization.controller";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { JwtClaimsService } from "@services/server/JwtClaims/JwtClaims.service";

export const serverContainer = Container.merge(
  clientContainer,
  new Container(),
);

serverContainer.bind(ServerConfig).toSelf();
serverContainer.bind(PrismaService).toSelf();
serverContainer.bind(OrganizationService).toSelf();
serverContainer.bind(OrganizationController).toSelf();
serverContainer.bind(UserService).toSelf();
serverContainer.bind(UserController).toSelf();
serverContainer.bind(JwtClaimsService).toSelf();

serverContainer.bind(TYPES.Cookies).toDynamicValue(() => cookies());

//export { serverContainer };
