import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`
  ======================================================
  ✨ MAISON ISHQ PARFUMS - API REST OPERATIONAL ✨
  ======================================================
  🚀 Serveur démarré sur : http://localhost:${env.PORT}
  🌍 Mode : ${env.NODE_ENV}
  🔗 API Healthcheck : http://localhost:${env.PORT}/api/health
  ======================================================
  `);
});

// Handling unhandled rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ UNHANDLED REJECTION! Fermeture du serveur...", err);
  server.close(() => {
    process.exit(1);
  });
});
