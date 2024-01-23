import { type PrismaClient } from "@prisma/client";

export class CardController {
  constructor(private db: PrismaClient) {}

  async get(userId: string) {
    return this.db.card.findMany({
      where: {
        userId,
      },
    });
  }

  async find(cardId: string, userId: string) {
    return this.db.card.findUnique({
      where: {
        id: cardId,
        userId,
      },
    });
  }

  async create(noteId: number, userId: string) {
    return this.db.card.upsert({
      where: {
        noteUser: { noteId, userId },
      },
      create: {
        noteId,
        userId,
      },
      update: {},
    });
  }

  async createMany(noteIds: number[], userId: string) {
    return this.db.card.createMany({
      data: noteIds.map((x) => ({ noteId: x, userId })),
      skipDuplicates: true,
    });
  }

  async delete(cardId: string, userId: string) {
    return this.db.card.delete({
      where: {
        id: cardId,
        userId,
      },
    });
  }
}
