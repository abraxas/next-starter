import "reflect-metadata";

import { Container } from "inversify";
import ClientConfig from "@/services/client/config/ClientConfig";
import { clientContainer } from "@/services/clientContainer";
import ServerConfig from "@/services/server/config/ServerConfig";
import { TYPES } from "@/services/types";
import { PrismaService } from "@/services/server/prisma";
import { OrganizationService } from "@/services/server/organizations/OrganizationService";

const serverContainer = Container.merge(clientContainer, new Container());
serverContainer.bind<ServerConfig>(ServerConfig).to(ServerConfig);
serverContainer
  .bind<PrismaService>(PrismaService)
  .to(PrismaService)
  .inSingletonScope();
serverContainer
  .bind<OrganizationService>(OrganizationService)
  .to(OrganizationService);

export { serverContainer };
