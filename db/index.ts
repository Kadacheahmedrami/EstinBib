import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use a fallback URL during build time if DATABASE_URL is not provided
const databaseUrl = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const sql = postgres(databaseUrl);
export const db = drizzle(sql, { schema });

export type DbClient = typeof db;