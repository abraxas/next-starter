import { injectable } from "inversify";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import ServerConfig from "@services/server/config/ServerConfig";
import { cookies } from "next/headers";

export type NewUserClaim = {
  type: "new_user";
  email: string;
  provider?: string;
  providerId?: string;
};
export type NewUserClaimUntyped = Omit<NewUserClaim, "type"> & {
  type?: "new_user";
};

export const NewUserClaimSchema = z.object({
  type: z.literal("new_user"),
  email: z.string(),
  provider: z.string().optional(),
  providerId: z.string().optional(),
}) satisfies z.ZodSchema<NewUserClaim>;

export type TotpClaim = {
  type: "totp";
  userId: string;
};
export type TotpClaimUntyped = Omit<TotpClaim, "type"> & { type?: "totp" };

export const TotpClaimSchema = z.object({
  type: z.literal("totp"),
  userId: z.string(),
}) satisfies z.ZodSchema<TotpClaim>;

export type JwtClaim = NewUserClaim | TotpClaim;

@injectable()
export class JwtClaimsService {
  constructor(private configService: ServerConfig) {}

  public getClaimType(jwtToken: string): string;
  public getClaimType(data: JwtClaim | undefined): string;
  public getClaimType(input: string | JwtClaim | undefined): string {
    if (!input) return "unknown";
    if (typeof input === "string") {
      const secret = this.configService.authSecret;
      const payload = jwt.verify(input, secret);
      if (typeof payload === "string") {
        throw new Error("Invalid Claim");
      }
      return payload?.type ?? "unknown";
    } else {
      return input.type;
    }
  }

  public createNewUserClaim(claim: NewUserClaimUntyped): string {
    const secret = this.configService.authSecret;
    return jwt.sign(
      NewUserClaimSchema.parse({
        ...claim,
        type: "new_user",
      }),
      secret,
      {
        expiresIn: "1h",
      },
    );
  }
  public readNewUserClaim(jwtToken: string): NewUserClaim {
    const secret = this.configService.authSecret;
    const payload = jwt.verify(jwtToken, secret);
    return NewUserClaimSchema.parse(payload);
  }

  public setNewUserClaim(claim: NewUserClaimUntyped) {
    const jwtToken = this.createNewUserClaim(claim);
    const cookieStore = cookies();
    cookieStore.set("jwtclaim", jwtToken);
  }

  public createTotpClaim(claim: TotpClaimUntyped): string {
    const secret = this.configService.authSecret;
    return jwt.sign(
      TotpClaimSchema.parse({
        ...claim,
        type: "totp",
      }),
      secret,
      {
        expiresIn: "1h",
      },
    );
  }
  public readTotpClaim(jwtToken: string): TotpClaim {
    const secret = this.configService.authSecret;
    const payload = jwt.verify(jwtToken, secret);
    return TotpClaimSchema.parse(payload);
  }

  public setTotpClaim(claim: TotpClaimUntyped) {
    const jwtToken = this.createTotpClaim(claim);
    const cookieStore = cookies();
    cookieStore.set("jwtclaim", jwtToken);
  }

  public getClaimFromCookie() {
    const cookieStore = cookies();
    const jwtToken = cookieStore.get("jwtclaim");
    if (!jwtToken) return undefined;
    const claimType = this.getClaimType(jwtToken.value);
    switch (claimType) {
      case "new_user":
        return this.readNewUserClaim(jwtToken.value);
      case "totp":
        return this.readTotpClaim(jwtToken.value);
      default:
        return undefined;
    }
  }

  public verifyNewUserClaim(claim?: JwtClaim): NewUserClaim {
    return NewUserClaimSchema.parse(claim);
  }

  public verifyTotpClaim(claim?: JwtClaim): TotpClaim {
    return TotpClaimSchema.parse(claim);
  }

  public setClaimCookie(claim: JwtClaim) {
    const jwtToken =
      claim.type === "new_user"
        ? this.createNewUserClaim(claim)
        : this.createTotpClaim(claim);
    const cookieStore = cookies();
    cookieStore.set("jwtclaim", jwtToken);
  }
}
