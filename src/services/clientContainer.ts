import { Container } from "inversify";
import ClientConfig from "@/services/client/ClientConfig";
import { TYPES } from "@/services/types";

const clientContainer = new Container();
clientContainer.bind(TYPES.ClientConfig).to(ClientConfig);
// myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
// myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
// myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export { clientContainer };
