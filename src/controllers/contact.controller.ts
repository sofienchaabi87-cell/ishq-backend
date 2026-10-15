import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services/contact.service.js";
import { MessageStatus } from "@prisma/client";

export class ContactController {
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await ContactService.createMessage(req.body);
      res.status(201).json({
        success: true,
        message: "Votre message a été transmis avec succès à la Maison ISHQ",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as MessageStatus | undefined;
      const messages = await ContactService.getAllMessages(status);
      res.status(200).json({
        success: true,
        count: messages.length,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await ContactService.updateMessageStatus(id, status);
      res.status(200).json({
        success: true,
        message: "Statut du message mis à jour",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
