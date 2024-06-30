import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class PrismaService {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  get client(): PrismaClient {
    return this._prisma;
  }
}
