import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";

const prisma = new PrismaClient();

export interface CreateProductInput {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  categoryLabel: string;
  image: string;
  description: string;
  size?: string;
  notes: {
    head: string;
    heart: string;
    base: string;
  };
  rating?: number;
  badge?: string;
  stock?: number;
}

export class ProductService {
  static async getAllProducts(category?: string) {
    const whereCondition: any = { isActive: true };
    if (category) {
      whereCondition.category = category;
    }

    const products = await prisma.product.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });

    return products;
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw ApiError.notFound(`Le parfum avec l'identifiant '${id}' est introuvable`);
    }

    return product;
  }

  static async createProduct(data: CreateProductInput) {
    const existing = await prisma.product.findUnique({
      where: { id: data.id },
    });

    if (existing) {
      throw ApiError.badRequest(`Un produit avec le slug ID '${data.id}' existe déjà`);
    }

    const product = await prisma.product.create({
      data: {
        id: data.id,
        name: data.name,
        subtitle: data.subtitle,
        price: data.price,
        originalPrice: data.originalPrice || null,
        category: data.category,
        categoryLabel: data.categoryLabel,
        image: data.image,
        description: data.description,
        size: data.size || "10 ml · Roll-on",
        notes: data.notes,
        rating: data.rating ?? 5.0,
        badge: data.badge || null,
        stock: data.stock ?? 100,
      },
    });

    return product;
  }

  static async updateProduct(id: string, data: Partial<CreateProductInput>) {
    await this.getProductById(id);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        price: data.price !== undefined ? data.price : undefined,
        originalPrice: data.originalPrice !== undefined ? data.originalPrice : undefined,
      },
    });

    return updated;
  }

  static async updateProductPrice(id: string, price: number, originalPrice?: number | null) {
    await this.getProductById(id);

    if (price <= 0) {
      throw ApiError.badRequest("Le prix doit être strictement supérieur à 0");
    }

    if (originalPrice !== undefined && originalPrice !== null && originalPrice <= price) {
      throw ApiError.badRequest("Le prix d'origine/promotionnel doit être supérieur au prix actuel");
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        price,
        originalPrice: originalPrice ?? null,
      },
    });

    return updated;
  }

  static async deleteProduct(id: string) {
    await this.getProductById(id);

    // Soft delete par sécurité
    const deleted = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return deleted;
  }
}
