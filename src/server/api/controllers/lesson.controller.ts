import { INTERVALS } from "@/constants/intervals";
import { NOVICE_1 } from "@/constants/steps";
import { roundToHour } from "@/utils/round-hour";
import { type PrismaClient } from "@prisma/client";
import { add } from "date-fns";

export class LessonController {
  constructor(private db: PrismaClient) {}

  /**
   * Count the number of lessons a user has.
   *
   * @param userId ID of the student.
   */
  async countLessons(userId: string) {
    return this.db.card.count({
      where: {
        stage: 0,
        userId,
      },
    });
  }

  /**
   * Get next batch of items
   *
   * @param userId
   */
  async getNextLesson(userId: string) {
    const BATCH_SIZE = 5;

    return this.db.card.findMany({
      where: {
        stage: 0,
        userId,
      },
      include: {
        note: true,
      },
      orderBy: [
        {
          note: {
            type: "desc",
          },
        },
      ],
      take: BATCH_SIZE,
    });
  }

  /**
   * Mark a given card as learned.
   *
   * @param param0
   * @returns
   */
  async markAsIncorrect({
    userId,
    cardId,
  }: {
    userId: string;
    cardId: string;
  }) {
    const card = await this.db.card.findFirst({
      where: {
        userId,
        id: cardId,
      },
    });

    if (card === null) {
      return;
    }

    await this.db.card.update({
      where: {
        id: cardId,
      },
      data: {
        wrongStreak: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Mark a given card as learned.
   *
   * @param param0
   * @returns
   */
  async markAsLearned({ userId, cardId }: { userId: string; cardId: string }) {
    const card = await this.db.card.findFirst({
      where: {
        userId,
        id: cardId,
      },
      include: {
        note: true,
      },
    });

    if (card === null) {
      return;
    }

    await this.db.card.update({
      where: {
        id: cardId,
      },
      data: {
        stage: NOVICE_1,
        nextReviewAt: roundToHour(add(new Date(), INTERVALS[NOVICE_1]!)),
        learnedAt: new Date(),
        wrongStreak: 0,
      },
    });
  }
}
