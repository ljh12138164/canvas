import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

// note数据库
export const workspaces = pgTable("workspaces", {
  id: text("id").default(nanoid()).primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
});
