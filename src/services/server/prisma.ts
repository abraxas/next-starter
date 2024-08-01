import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production")
  globalThis.prismaGlobal = prismaClient;

@injectable()
export class PrismaService {
  constructor() {}

  get client(): PrismaClient {
    return prismaClient;
  }
}
