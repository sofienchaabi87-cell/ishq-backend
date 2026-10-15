import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { z } from "zod";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

const createProductSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Le nom du parfum est requis"),
    subtitle: z.string().optional().default("Huile de Parfum Originelle"),
    price: z.number().positive("Le prix doit être positif"),
    originalPrice: z.number().positive().nullable().optional(),
    category: z.string().optional().default("signature"),
    categoryLabel: z.string().optional().default("Signature"),
    image: z.string().optional().default("/assets/collection-santorini.jpg"),
    description: z.string().optional().default("Une composition olfactive d'exception signée ISHQ Parfums."),
    size: z.string().optional().default("10 ml · Roll-on"),
    notes: z.any().optional().default({ head: "", heart: "", base: "" }),
    rating: z.number().optional().default(5),
    badge: z.string().nullable().optional(),
    stock: z.number().int().optional().default(20),
  }),
});

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

router.post(
  "/upload",
  authenticate,
  authorizeRole(["ADMIN"]),
  uploadMiddleware.single("image"),
  ProductController.uploadImage
);

router.post(
  "/",
  authenticate,
  authorizeRole(["ADMIN"]),
  validate(createProductSchema),
  ProductController.create
);

router.put(
  "/:id",
  authenticate,
  authorizeRole(["ADMIN"]),
  ProductController.update
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole(["ADMIN"]),
  ProductController.delete
);

export default router;
