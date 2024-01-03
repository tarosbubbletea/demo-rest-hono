import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Hono } from "hono";
import * as schema from "../db/schema";
import { createSelectSchema } from "drizzle-zod";
import { eq, and } from "drizzle-orm";

type Variables = {
  db: NeonDatabase<typeof schema>;
};

const flawedauth = new Hono<{ Variables: Variables }>();

flawedauth.post("/", async (c) => {
  const db = c.get("db");
  const body = await c.req.json();
  const userSchemaNoID = createSelectSchema(schema.User).omit({
    id: true,
    usertype_id: true,
  });
  const val = userSchemaNoID.safeParse(body);
  if (!val.success) return c.text("Invalid request.", 400);
  // typescript thinks this code is not safe despite checking for null in const val declaration.
  // so, null coalescing operator to the rescue.
  const email = val.data.email ?? "";
  const pwd = val.data.password ?? "";

  const query = await db
    .select()
    .from(schema.User)
    .where(and(eq(schema.User.email, email), eq(schema.User.password, pwd)));

  if (query.length == 0) return c.text("Invalid credentials.", 401);

  return c.body("ok", 200);
});

export { flawedauth };
