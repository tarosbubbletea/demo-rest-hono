import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Hono } from "hono";
import * as Schema from "../db/schema";
import { createSelectSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

type Variables = {
  db: NeonDatabase<typeof Schema>;
};

const campus = new Hono<{ Variables: Variables }>();

campus.get("/", async (c) => {
  const db = c.get("db");
  const persona = await db.select().from(Schema.Campus);
  return c.json(persona);
});

export { campus };
