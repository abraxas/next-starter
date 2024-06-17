import { pgTable, uniqueIndex, foreignKey, text, timestamp, primaryKey, integer, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"
import { relations } from "drizzle-orm/relations";



export const session = pgTable("sessions", {
	id: text("id", {
	}).primaryKey(),
	accountId: text("account_id", {}),
		//.notNull(),
		//.references(() => account.providerAccountId),
	userId: text("user_id", {})
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp("expires_at").notNull()
});

export const user = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email"),
	hashedPassword: text("hashedPassword"),
	emailVerified: timestamp("emailVerified", { precision: 3, mode: 'string' }),
	image: text("image"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'date' }).notNull(),
},
(table) => {
	return {
		email_key: uniqueIndex("user_email_key").using("btree", table.email),
	}
});

// export const verificationToken = pgTable("verification_tokens", {
// 	identifier: text("identifier").notNull(),
// 	token: text("token").notNull(),
// 	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
// },
// (table) => {
// 	return {
// 		VerificationToken_pkey: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_pkey"}),
// 	}
// });
//
// export const authenticator = pgTable("authenticator_codees", {
// 	credentialID: text("credentialID").notNull(),
// 	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
// 	providerAccountId: text("providerAccountId").notNull(),
// 	credentialPublicKey: text("credentialPublicKey").notNull(),
// 	counter: integer("counter").notNull(),
// 	credentialDeviceType: text("credentialDeviceType").notNull(),
// 	credentialBackedUp: boolean("credentialBackedUp").notNull(),
// 	transports: text("transports"),
// },
// (table) => {
// 	return {
// 		credentialID_key: uniqueIndex("authenticator_credentialID_key").using("btree", table.credentialID),
// 		Authenticator_pkey: primaryKey({ columns: [table.credentialID, table.userId], name: "Authenticator_pkey"}),
// 	}
// });

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),

	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'date' }).notNull(),
	// access_token: text("access_token"),
	expires_at: integer("expires_at"),
	// id_token: text("id_token"),
	// refresh_token: text("refresh_token"),
	// scope: text("scope"),
	// session_state: text("session_state"),
	// token_type: text("token_type"),
//	type: text("type").notNull(),
},
(table) => {
	return {
		account_pkey: primaryKey({ columns: [table.providerAccountId, table.provider], name: "account_pkey"}),
	}
});


export const SessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const UserRelations = relations(user, ({many}) => ({
	sessions: many(session),
//	Authenticators: many(authenticator),
	accounts: many(account),
}));

// export const AuthenticatorRelations = relations(authenticator, ({one}) => ({
// 	User: one(user, {
// 		fields: [authenticator.userId],
// 		references: [user.id]
// 	}),
// }));

export const AccountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));