import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

// Middlewares globaux
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

import path from "path";

// Servir les fichiers statiques pour le Dashboard Admin
app.use(express.static("public"));

// Route explicite pour ouvrir le Dashboard Admin sur /admin et /dashboard
app.get(["/", "/admin", "/dashboard"], (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Inscription des routes API avec le préfixe /api
app.use("/api", routes);

// Route par défaut (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `La route [${req.method} ${req.url}] n'existe pas sur ce serveur.`,
  });
});

// Middleware de gestion d'erreurs centralisée
app.use(errorHandler);

export default app;

