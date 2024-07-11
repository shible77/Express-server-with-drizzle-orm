import {int, mysqlTable, serial, varchar, datetime } from "drizzle-orm/mysql-core";
import { sql } from 'drizzle-orm'

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
});

export const products = mysqlTable("products", {
  product_id: serial("product_id").primaryKey(),
  product_name : varchar("product_name", { length : 40}).notNull(),
  description : varchar("description", {length : 200})
})

export const auth_session = mysqlTable("auth_session", {
  session_id : varchar("session_id", { length : 50}).primaryKey(),
  user_id : int("user_id").notNull(),
  created_at : datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull()
})
