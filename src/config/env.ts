import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const nodeEnv = process.env.NODE_ENV || "development";
const databaseUrl = process.env.DATABASE_URL || "";
const jwtSecret =
  process.env.JWT_SECRET || "ishq_super_secret_jwt_key_2026_production_secure_token";

if (nodeEnv === "production") {
  if (!databaseUrl) {
    console.warn("⚠️ DATABASE_URL is not set in Vercel environment variables.");
  }
}

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: nodeEnv,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:8080",
  DATABASE_URL: databaseUrl,
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
