import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { session, user, account, organization } from "./schema";

export type SessionSelectModel = InferSelectModel<typeof session>;
export type SessionInsertModel = InferInsertModel<typeof session>;

export type UserSelectModel = InferSelectModel<typeof user>;
export type UserInsertModel = InferInsertModel<typeof user>;

export type AccountSelectModel = InferSelectModel<typeof account>;
export type AccountInsertModel = InferInsertModel<typeof account>;

export type OrganizationSelectModel = InferSelectModel<typeof organization>;
export type OrganizationInsertModel = InferInsertModel<typeof organization>;
