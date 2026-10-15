import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service.js";

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const products = await ProductService.getAllProducts(category);
      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.id) {
        req.body.id = (req.body.name || "parfum")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
      }
      if (!req.body.subtitle) req.body.subtitle = "Huile de Parfum Originelle";
      if (!req.body.description || req.body.description.length < 5) {
        req.body.description = "Une création olfactive d'exception signée ISHQ Parfums.";
      }
      if (!req.body.categoryLabel) req.body.categoryLabel = req.body.category || "Signature";
      if (!req.body.notes || typeof req.body.notes !== "object") {
        req.body.notes = { head: "Agrumes", heart: "Jasmin", base: "Ambre" };
      }
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: "Nouveau parfum crÃ©Ã© avec succÃ¨s",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ProductService.updateProduct(id, req.body);
      res.status(200).json({
        success: true,
        message: "Parfum mis Ã  jour avec succÃ¨s",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { price, originalPrice } = req.body;
      const updatedProduct = await ProductService.updateProductPrice(id, price, originalPrice);
      res.status(200).json({
        success: true,
        message: "Prix du parfum mis Ã  jour avec succÃ¨s",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Aucun fichier image n'a Ã©tÃ© fourni",
        });
        return;
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({
        success: true,
        message: "Image tÃ©lÃ©versÃ©e avec succÃ¨s",
        url: imageUrl,
        filename: req.file.filename,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      res.status(200).json({
        success: true,
        message: "Parfum retirÃ© du catalogue actif",
      });
    } catch (error) {
      next(error);
    }
  }
}

