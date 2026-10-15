import { Router } from "express";
import { ContactController } from "../controllers/contact.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Le nom est obligatoire"),
    email: z.string().email("L'adresse e-mail est invalide"),
    message: z.string().min(5, "Le message doit comporter au moins 5 caractères"),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["UNREAD", "READ", "ARCHIVED"]),
  }),
});

router.post("/", validate(contactSchema), ContactController.sendMessage);

// Administration des messages
router.get(
  "/",
  authenticate,
  authorizeRole(["ADMIN"]),
  ContactController.getAllMessages
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRole(["ADMIN"]),
  validate(updateStatusSchema),
  ContactController.updateStatus
);

export default router;
