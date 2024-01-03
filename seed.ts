import env from "./env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as Schema from "./src/db/schema";
import { eq } from "drizzle-orm";

const db = drizzle(neon(env.url));

// non exhaustive list
const carreras = [
  "TNS Administración Empresas",
  "TNS Agrícola",
  "TNS Comercio Exterior",
  "TNS Computación e Informática especialidad en Ciberseguridad",
  "TNS Construcción",
  "TNS Educación Parvularia",
  "TNS Electricidad",
  "TNS Enfermería",
  "TNS Gastronomía",
  "TNS Instrumentación y control industrial",
  "TNS Logística",
  "TNS Mantención industrial",
  "TNS Mecánica Automotriz",
  "TNS Operaciones Mineras",
  "TNS Operaciones Portuarias",
  "TNS Preparación Física y Gestión Eventos Deportivos",
  "TNS Trabajo Social",
  "TNS Turismo y Hotelería",
];

async function routine() {
  await db.insert(Schema.UserType).values([
    {
      id: Schema.UserType.id.default,
      name: "Admin",
    },
    {
      id: Schema.UserType.id.default,
      name: "Estudiante",
    },
  ]);

  await db.insert(Schema.User).values([
    {
      id: Schema.User.id.default,
      email: "admin@gmail.com",
      password: "1234",
      usertype_id: 1,
    },
    {
      id: Schema.User.id.default,
      email: "usuario@gmail.com",
      password: "1234",
      usertype_id: 2,
    },
    {
      id: Schema.User.id.default,
      email: "usuario2@gmail.com",
      password: "1234",
      usertype_id: 2,
    },
  ]);

  await db.insert(Schema.Campus).values([
    {
      id: Schema.Campus.id.default,
      name: "La Ligua",
    },
    {
      id: Schema.Campus.id.default,
      name: "Quillota",
    },
    {
      id: Schema.Campus.id.default,
      name: "Limache",
    },
    {
      id: Schema.Campus.id.default,
      name: "La Calera",
    },
    {
      id: Schema.Campus.id.default,
      name: "Valparaíso",
    },
    {
      id: Schema.Campus.id.default,
      name: "Viña del Mar",
    },
  ]);

  await db.insert(Schema.Career).values(
    carreras.map((c) => ({
      id: Schema.Career.id.default,
      name: c,
    }))
  );

  await db.insert(Schema.Persona).values({
    id: Schema.Persona.id.default,
    user_id: 2,
    name: "Gabriel Gutiérrez",
    rut: "12345678-9",
    campus_id: 1,
    career_id: 4,
    semester: 4,
    year: 2023,
  });

  await db.insert(Schema.Persona).values({
    id: Schema.Persona.id.default,
    user_id: 3,
    name: "Patricio Morales",
    rut: "12345678-9",
    campus_id: 1,
    career_id: 4,
    semester: 4,
    year: 2023,
  });
}

const main = async () => {
  try {
    await routine();
    console.log("Seeded data correctly.");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

main();
