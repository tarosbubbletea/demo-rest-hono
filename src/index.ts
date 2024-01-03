import { NeonDatabase, drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as routes from "./routes/";
import * as schema from "./db/schema";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";

import { serveStatic } from "hono/cloudflare-workers";

type Variables = {
  db: NeonDatabase<typeof schema>;
  auth: ReturnType<typeof bearerAuth>;
};

type Env = {
  PGDATABASE: string;
  PGUSER: string;
  PGPASSWORD: string;
  PGHOST: string;
  TOKEN: string;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app
  .use("*", async (c, next) => {
    // secrets are undefined on local env.
    // remember to use .dev.vars for Wrangler secrets integration.
    //console.log(c.env.PGHOST);

    const pool = new Pool({
      database: c.env.PGDATABASE,
      user: c.env.PGUSER,
      password: c.env.PGPASSWORD,
      host: c.env.PGHOST,
    });
    const db = await drizzle(pool, { schema });
    c.set("db", db);
    await next();
  })

  // generate some random uuid for this, no need for complications.
  .use("/api/*", async (c, next) => {
    const token = c.env.TOKEN;
    const bearer = bearerAuth({ token });
    await bearer(c, next);
  });

app
  .get("/favicon.ico", serveStatic({ path: "./static/favicon.ico" }))
  .route("/api/user", routes.user)
  .route("/api/persona", routes.persona)
  .route("/api/auth", routes.flawedauth) // should be using bearer auth or session for data changes but lazy. just gonna check for 200
  .route("/api/usertypes", routes.usertypes)
  .route("/api/campus", routes.campus)
  .route("/api/careers", routes.careers);

export default app;
