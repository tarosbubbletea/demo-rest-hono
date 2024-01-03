import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Hono } from "hono";
import * as Schema from "../db/schema";
import { createSelectSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

type Variables = {
  db: NeonDatabase<typeof Schema>;
};

const usertypes = new Hono<{ Variables: Variables }>();

usertypes.get("/", async (c) => {
  const db = c.get("db");
  const persona = await db.select().from(Schema.UserType);
  return c.json(persona);
});

export { usertypes };
