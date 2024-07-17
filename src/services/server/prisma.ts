import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

const prismaClient = new PrismaClient();

@injectable()
export class PrismaService {
  constructor() {}

  get client(): PrismaClient {
    return prismaClient;
  }
}
