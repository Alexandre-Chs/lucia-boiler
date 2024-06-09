import { pgTable, text } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const oauthAccount = pgTable("oauth_account", {
  providerId: text("provider_id").notNull().primaryKey(),
  providerUserId: text("provider_user_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export type oauthAccount = typeof oauthAccount.$inferSelect;
