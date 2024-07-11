import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

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
