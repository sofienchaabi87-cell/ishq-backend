import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import orderRoutes from "./order.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/contact", contactRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "ISHQ Parfums Backend API",
    timestamp: new Date().toISOString(),
  });
});

export default router;
