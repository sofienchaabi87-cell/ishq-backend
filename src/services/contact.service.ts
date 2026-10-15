import { PrismaClient, MessageStatus } from "@prisma/client";
import { ApiError } from "../utils/apiError.js";

const prisma = new PrismaClient();

export interface CreateContactInput {
  name: string;
  email: string;
  message: string;
}

export class ContactService {
  static async createMessage(data: CreateContactInput) {
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        status: MessageStatus.UNREAD,
      },
    });

    return contactMessage;
  }

  static async getAllMessages(status?: MessageStatus) {
    const whereCondition = status ? { status } : {};

    const messages = await prisma.contactMessage.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });

    return messages;
  }

  static async updateMessageStatus(id: string, status: MessageStatus) {
    const existing = await prisma.contactMessage.findUnique({ where: { id } });

    if (!existing) {
      throw ApiError.notFound("Message non trouvé");
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return updated;
  }
}
