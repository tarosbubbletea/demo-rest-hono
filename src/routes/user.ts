import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Hono } from "hono";
import * as schema from "../db/schema";
import { createSelectSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

type Variables = {
  db: NeonDatabase<typeof schema>;
};

const user = new Hono<{ Variables: Variables }>();

// could compress this easily if I wanted to.
user.get("/", async (c) => {
  const db = c.get("db");
  const query = await db.select().from(schema.User);
  return c.body(JSON.stringify(query), 200);
});

user.post("/", async (c) => {
  const db = c.get("db");
  const body = await c.req.json();
  const userSchemaNoID = createSelectSchema(schema.User).omit({ id: true });
  const val = userSchemaNoID.safeParse(body);
  if (!val.success) return c.text("Invalid request.", 400);

  const [query] = await db
    .insert(schema.User)
    .values({
      id: schema.User.id.default, // don't trust the client.
      email: val.data.email,
      password: val.data.password,
      usertype_id: val.data.usertype_id,
    })
    .returning();
  return c.body(JSON.stringify(query), 201);
});

user.get("/:id", async (c) => {
  const db = c.get("db");
  const { id } = c.req.param();
  const query = await db
    .select()
    .from(schema.User)
    .where(eq(schema.User.id, Number(id)));
  if (query.length == 0) return c.text("Invalid identifier.", 500);

  return c.body(JSON.stringify(query), 200);
});

user.put("/:id", async (c) => {
  const db = c.get("db");
  const { id } = c.req.param();
  const body = await c.req.json();

  const userSchemaNoID = createSelectSchema(schema.User).omit({ id: true });
  const val = userSchemaNoID.safeParse(body);
  if (!val.success) return c.text("Invalid request.", 400);

  const preparedComparison = eq(schema.User.id, Number(id));
  const search = await db.select().from(schema.User).where(preparedComparison);
  if (search.length == 0) return c.text("Invalid identifier.", 400);

  const [query] = await db
    .update(schema.User)
    .set({
      id: Number(id), // use ID from param, not body, for safety.
      email: val.data.email,
      password: val.data.password,
      usertype_id: val.data.usertype_id,
    })
    .where(preparedComparison)
    .returning();
  return c.body(JSON.stringify(query), 201);
});

user.delete("/:id", async (c) => {
  const db = c.get("db");
  const { id } = c.req.param();

  const preparedComparison = eq(schema.User.id, Number(id));
  const search = await db.select().from(schema.User).where(preparedComparison);
  if (search.length == 0) return c.text("Invalid identifier.", 401);

  const query = await db.delete(schema.User).where(preparedComparison);
  return c.body("Success", 201);
});

// app.openapi(
//   createRoute({
//     method: "get",
//     path: "/api",
//     summary: "Returns a list of users",
//     responses: {
//       200: {
//         description: "user data",
//         content: {
//           "application/json": {
//             schema: schema.zodSelectUsers.openapi({ type: "array" }),
//           },
//         },
//       },
//     },
//   }),

//   app.get(
//     "/ui",
//     swaggerUI({
//       url: "/doc",
//     })
//   );

//   app.doc("/doc", {
//     info: {
//       title: "API",
//       version: "v1",
//     },
//     openapi: "3.1.0",
//   });

export { user };
