import { NoteType, type PrismaClient } from "@prisma/client";

export class KanjiController {
  constructor(private db: PrismaClient) {}

  async countLearned(userId: string) {
    return this.db.card.count({
      where: {
        userId,
        passed: true,
        note: {
          type: NoteType.KANJI,
        },
      },
    });
  }
}
