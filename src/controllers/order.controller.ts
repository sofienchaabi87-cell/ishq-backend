import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service.js";
import { OrderStatus } from "@prisma/client";

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        message: "Commande passée avec succès",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as OrderStatus | undefined;
      const orders = await OrderService.getAllOrders(status);
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderByIdOrNumber(id);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;
      const updatedOrder = await OrderService.updateOrderStatus(id, status, trackingNumber);
      res.status(200).json({
        success: true,
        message: "Statut de la commande mis à jour",
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }
}
