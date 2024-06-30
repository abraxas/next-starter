import "reflect-metadata";

import { Container } from "inversify";
import ClientConfig from "@/services/client/ClientConfig";
import { clientContainer } from "@/services/clientContainer";
import ServerConfig from "@/services/server/ServerConfig";
import { TYPES } from "@/services/types";
import { PrismaService } from "@/services/server/prisma";

const serverContainer = Container.merge(clientContainer, new Container());
serverContainer.bind<ServerConfig>(TYPES.ServerConfig).to(ServerConfig);
serverContainer
  .bind<PrismaService>(TYPES.PrismaService)
  .to(PrismaService)
  .inSingletonScope();

export { serverContainer };
