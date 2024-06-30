import { Container } from "inversify";
import ClientConfig from "@/services/client/ClientConfig";
import { clientContainer } from "@/services/clientContainer";
import ServerConfig from "@/services/server/ServerConfig";
import { TYPES } from "@/services/types";

const serverContainer = Container.merge(clientContainer, new Container());
serverContainer.bind<ServerConfig>(TYPES.ServerConfig).to(ServerConfig);

export { serverContainer };
