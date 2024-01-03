import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Hono } from "hono";
import * as schema from "../db/schema";
import { createInsertSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

type Variables = {
  db: NeonDatabase<typeof schema>;
};

const persona = new Hono<{ Variables: Variables }>();

persona.get("/", async (c) => {
  const db = c.get("db");
  const persona = await db.select().from(schema.Persona);
  return c.json(persona);
});

persona.delete("/:id", async (c) => {
  const db = c.get("db");
  const { id } = c.req.param();
  const preparedComparison = eq(schema.Persona.id, Number(id));
  const search = await db
    .select()
    .from(schema.Persona)
    .where(preparedComparison);
  if (search.length == 0) return c.text("Invalid identifier.", 400);
  await db.delete(schema.Persona).where(preparedComparison);
  return c.text("Deleted.");
});

persona.post("/", async (c) => {
  const db = c.get("db");
  const personaSchemaNoID = createInsertSchema(schema.Persona).omit({
    id: true,
  });
  const body = await c.req.json();
  const val = personaSchemaNoID.safeParse(body);
  if (!val.success) return c.text("Invalid request.", 400);
  const [persona] = await db
    .insert(schema.Persona)
    .values({
      id: schema.Persona.id.default,
      user_id: val.data.user_id,
      name: val.data.name,
      rut: val.data.rut,
      campus_id: val.data.campus_id,
      career_id: val.data.career_id,
      semester: val.data.semester,
      year: val.data.year,
    })
    .returning();
  return c.json(persona);
});

persona.put("/:id", async (c) => {
  const db = c.get("db");
  const { id } = c.req.param();
  const body = await c.req.json();

  const personaSchemaNoID = createInsertSchema(schema.Persona).omit({
    id: true,
  });
  const val = personaSchemaNoID.safeParse(body);
  if (!val.success) return c.text("Invalid request.", 400);

  const preparedComparison = eq(schema.Persona.id, Number(id));
  const search = await db
    .select()
    .from(schema.Persona)
    .where(preparedComparison);
  if (search.length == 0) return c.text("Invalid identifier.", 400);

  const [persona] = await db
    .update(schema.Persona)
    .set({
      id: Number(id),
      user_id: val.data.user_id,
      name: val.data.name,
      rut: val.data.rut,
      campus_id: val.data.campus_id,
      career_id: val.data.career_id,
      semester: val.data.semester,
      year: val.data.year,
    })
    .where(preparedComparison)
    .returning();
  return c.json(persona);
});

export { persona };
