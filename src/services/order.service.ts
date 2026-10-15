import { PrismaClient, OrderStatus } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";

const prisma = new PrismaClient();

export interface CreateOrderItemInput {
  id: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  items: CreateOrderItemInput[];
}

export class OrderService {
  static async createOrder(payload: CreateOrderInput) {
    if (!payload.items || payload.items.length === 0) {
      throw ApiError.badRequest("Le panier ne peut pas être vide");
    }

    // 1. Charger tous les produits du panier depuis la base de données
    const productIds = payload.items.map((i) => i.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (dbProducts.length !== payload.items.length) {
      throw ApiError.badRequest("Certains produits du panier n'existent pas ou sont indisponibles");
    }

    // Map pour un accès rapide aux prix et détails
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 2. Calculer les totaux de manière sécurisée côté backend
    let cartTotal = 0;
    const orderItemsData = payload.items.map((item) => {
      const dbProduct = productMap.get(item.id)!;
      const unitPrice = Number(dbProduct.price);
      const subtotal = unitPrice * item.quantity;
      cartTotal += subtotal;

      return {
        productId: dbProduct.id,
        productName: dbProduct.name,
        size: dbProduct.size,
        unitPrice,
        quantity: item.quantity,
        subtotal,
      };
    });

    // Règle de livraison gratuite pour total >= 100 DT, sinon 7 DT
    const shippingThreshold = 100;
    const shippingCost = cartTotal >= shippingThreshold ? 0 : 7.0;
    const grandTotal = cartTotal + shippingCost;

    // Générer un code de commande de luxe unique (ex: ISHQ-8392)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ISHQ-${randomNum}`;

    // 3. Création transactionnelle de la commande et des articles
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          customerCity: payload.customerCity,
          cartTotal,
          shippingCost,
          grandTotal,
          status: OrderStatus.PENDING,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Décrémenter le stock des produits
      for (const item of payload.items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    return order;
  }

  static async getAllOrders(status?: OrderStatus) {
    const whereCondition = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }

  static async getOrderByIdOrNumber(identifier: string) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: identifier }, { orderNumber: identifier }],
      },
      include: { items: true },
    });

    if (!order) {
      throw ApiError.notFound(`La commande '${identifier}' est introuvable`);
    }

    return order;
  }

  static async updateOrderStatus(id: string, status: OrderStatus, trackingNumber?: string | null) {
    await this.getOrderByIdOrNumber(id);

    const updateData: any = { status };
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return updatedOrder;
  }
}
