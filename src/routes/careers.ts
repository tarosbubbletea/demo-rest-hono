import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Hono } from "hono";
import * as Schema from "../db/schema";

type Variables = {
  db: NeonDatabase<typeof Schema>;
};

const careers = new Hono<{ Variables: Variables }>();

careers.get("/", async (c) => {
  const db = c.get("db");
  const persona = await db.select().from(Schema.Career);
  return c.json(persona);
});

export { careers };
