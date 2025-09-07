import "dotenv/config";
import { config as loadEnv } from "dotenv";
// Cargar también variables desde .env.local (usado por Next.js en dev)
loadEnv({ path: ".env.local" });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! }
});
