import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { session, user, verificationToken, authenticator, account } from "./schema";

export type SessionSelectModel = InferSelectModel<typeof session>;
export type SessionInsertModel = InferInsertModel<typeof session>;

export type UserSelectModel = InferSelectModel<typeof user>;
export type UserInsertModel = InferInsertModel<typeof user>;

export type VerificationTokenSelectModel = InferSelectModel<typeof verificationToken>;
export type VerificationTokenInsertModel = InferInsertModel<typeof verificationToken>;

export type AuthenticatorSelectModel = InferSelectModel<typeof authenticator>;
export type AuthenticatorInsertModel = InferInsertModel<typeof authenticator>;

export type AccountSelectModel = InferSelectModel<typeof account>;
export type AccountInsertModel = InferInsertModel<typeof account>;