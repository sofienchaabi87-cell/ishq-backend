import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const nodeEnv = process.env.NODE_ENV || "development";
const databaseUrl = process.env.DATABASE_URL || "";
const jwtSecret =
  process.env.JWT_SECRET || (nodeEnv === "production" ? "" : "local-development-only-secret");

if (nodeEnv === "production") {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required in production.");
  }
  if (jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters in production.");
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
