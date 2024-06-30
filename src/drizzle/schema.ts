import {
  pgTable,
  uniqueIndex,
  foreignKey,
  text,
  timestamp,
  primaryKey,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm/relations";

export const session = pgTable("sessions", {
  id: text("id").primaryKey(),
  accountId: text("account_id"),
  organizationId: text("organization_id"),
  //.notNull(),
  //.references(() => account.providerAccountId),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at").notNull(),
});

export const user = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    organizationId: text("organization_id"),
    username: text("username"),
    email: text("email"),
    hashedPassword: text("hashedPassword"),
    emailVerified: timestamp("emailVerified", { precision: 3, mode: "string" }),
    image: text("image"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
  },
  (table) => {
    return {
      //email_key: uniqueIndex("user_email_key").using("btree", table.email),
    };
  },
);

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),

    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
    expires_at: integer("expires_at"),
  },
  (table) => {
    return {
      account_pkey: primaryKey({
        columns: [table.providerAccountId, table.provider],
        name: "account_pkey",
      }),
    };
  },
);

export const organization = pgTable(
  "organizations",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
  },
  (table) => {
    return {
      name_key: uniqueIndex("organization_name_key").using("btree", table.name),
    };
  },
);

export const SessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const UserRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  //	Authenticators: many(authenticator),
  accounts: many(account),
}));

export const AccountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
