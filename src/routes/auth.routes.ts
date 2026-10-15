import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { z } from "zod";

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format d'email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  }),
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Le nom est obligatoire"),
    email: z.string().email("Format d'email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  }),
});

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/register", validate(registerSchema), AuthController.register);
router.get("/me", authenticate, AuthController.getMe);

export default router;
