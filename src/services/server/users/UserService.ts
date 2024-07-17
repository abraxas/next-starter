import "reflect-metadata";

import { injectable } from "inversify";
import { PrismaService } from "@services/server/prisma";
import { validateRequest } from "@/lib/auth";
import { Prisma } from "@prisma/client";

@injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUserSession() {
    return validateRequest();
  }

  static getSelectFields(includeSensitive?: boolean): Prisma.UserSelect {
    return {
      id: true,
      email: true,
      emailVerified: true,
      username: true,
      image: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      organizationId: true,
      ...(includeSensitive
        ? {
            hashedPassword: true,
            passwordAlgorithm: true,
          }
        : {}),
      adminUser: true,
    };
  }

  async getUserById(id: string, includeSensitive?: boolean) {
    return this.prismaService.client.user.findUnique({
      where: {
        id,
      },
      select: UserService.getSelectFields(includeSensitive),
    });
  }

  async getCurrentUser(includeSensitive?: boolean) {
    const session = await this.getUserSession();
    if (!session?.user?.id) return undefined;
    return this.getUserById(session.user.id, includeSensitive);
  }

  isAdmin(user: any): boolean {
    return !!user.adminUser;
  }

  async assertCurrentUserIsAdmin() {
    const user = await this.getCurrentUser();
    if (!user || !this.isAdmin(user)) {
      throw new Error("User is not an admin");
    }
  }
}
