import "reflect-metadata";

import { Container } from "inversify";
import ClientConfig from "@services/client/config/ClientConfig";
import { clientContainer } from "@services/clientContainer";
import ServerConfig from "@services/server/config/ServerConfig";
import { TYPES } from "@services/types";
import { PrismaService } from "@services/server/prisma";
import { OrganizationService } from "@services/server/organizations/OrganizationService";
import { UserService } from "@services/server/users/UserService";
import { UserController } from "@services/server/users/UserController";
import { OrganizationController } from "@services/server/organizations/OrganizationController";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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

serverContainer.bind(TYPES.Cookies).toDynamicValue(() => cookies());

//export { serverContainer };
