import {
  pgTable,
  serial,
  text,
  doublePrecision,
  smallint,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const UserType = pgTable("usertypes", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const User = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  password: text("password"),
  usertype_id: smallint("usertype_id").references(() => UserType.id),
});

export const Campus = pgTable("campus", {
  id: serial("id").primaryKey(),
  name: text("name").unique(),
});

export const Career = pgTable("careers", {
  id: serial("id").primaryKey(),
  name: text("name").unique(),
});

export const Persona = pgTable("personas", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id")
    .unique()
    .references(() => User.id, { onDelete: "cascade" }),
  name: text("name"),
  rut: text("rut"),
  campus_id: serial("campus_id").references(() => Campus.id),
  career_id: serial("career_id").references(() => Career.id),
  semester: smallint("semester"),
  year: smallint("year"),
});
