import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { z } from "zod";

const router = Router();

const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, "Le nom du client est requis"),
    customerEmail: z.string().email("L'adresse e-mail est invalide"),
    customerPhone: z.string().min(8, "Le numéro de téléphone est requis"),
    customerCity: z.string().min(2, "La ville de livraison est requise"),
    items: z.array(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive("La quantité doit être supérieure à 0"),
      })
    ).min(1, "Le panier doit contenir au moins un parfum"),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
    trackingNumber: z.string().nullable().optional(),
  }),
});

router.post("/", validate(createOrderSchema), OrderController.createOrder);
router.get("/:id", OrderController.getOrderById);

// Routes réservées aux administrateurs
router.get(
  "/",
  authenticate,
  authorizeRole(["ADMIN"]),
  OrderController.getAllOrders
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRole(["ADMIN"]),
  validate(updateStatusSchema),
  OrderController.updateStatus
);

export default router;
