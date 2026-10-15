import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:8080",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ishq_db?schema=public",
  JWT_SECRET: process.env.JWT_SECRET || "ishq_luxe_parfum_secret_key_change_me_in_production_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
