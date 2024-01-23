import { FUZZ, INTERVALS } from "@/constants/intervals";
import { NOVICE_1, INTERMEDIATE_1, LEGENDARY } from "@/constants/steps";
import { roundToHour } from "@/utils/round-hour";
import { NoteType, type PrismaClient } from "@prisma/client";
import { add, isAfter } from "date-fns";

export class ReviewController {
  constructor(private db: PrismaClient) {}

  /**
   * Count the number of reviews a user has.
   *
   * @param userId ID of the student.
   */
  async countReviews(userId: string) {
    return this.db.card.count({
      where: {
        stage: {
          gt: 0,
          lt: LEGENDARY,
        },
        nextReviewAt: {
          lt: new Date(),
        },
        userId,
      },
    });
  }

  /**
   * Count the number of reviews a user has.
   *
   * @param userId ID of the student.
   */
  async countLearned(userId: string) {
    return this.db.card.count({
      where: {
        stage: {
          gt: 0,
        },
        note: {
          type: NoteType.KANJI,
        },
        passed: true,
        userId,
      },
    });
  }

  async forecastReviews(userId: string) {
    return this.db.card.groupBy({
      where: {
        stage: {
          gt: 0,
          lt: LEGENDARY,
        },
        nextReviewAt: {
          lte: add(new Date(), { hours: 24 }),
          gt: new Date(),
        },
        userId,
      },
      _count: true,
      orderBy: {
        nextReviewAt: "asc",
      },
      by: ["nextReviewAt"],
    });
  }

  /**
   * Get all the reviews a user has.
   *
   * @param userId ID of the student.
   */
  async getReviews(userId: string) {
    const REVIEW_LIMIT = process.env.NODE_ENV === "production" ? 25 : 5;

    return this.db.card.findMany({
      where: {
        stage: {
          gt: 0,
          lt: LEGENDARY,
        },
        nextReviewAt: {
          lt: new Date(),
        },
        userId,
      },
      orderBy: [
        {
          nextReviewAt: "asc",
        },
      ],
      include: {
        note: true,
      },
      take: REVIEW_LIMIT,
    });
  }

  /**
   * Count the number of reviews a user has.
   *
   * @param userId ID of the student.
   */
  async getNextReviewTime(userId: string) {
    return this.db.card.findFirst({
      where: {
        stage: {
          gt: 0,
          lt: LEGENDARY,
        },
        userId,
      },
      orderBy: {
        nextReviewAt: "asc",
      },
      select: {
        nextReviewAt: true,
      },
    });
  }

  /**
   * Mark a given card as correctly answered.
   *
   * @param param0
   * @returns
   */
  async markAsCorrect({ userId, cardId }: { userId: string; cardId: string }) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user === null) {
      return;
    }

    const card = await this.db.card.findFirst({
      where: {
        userId,
        id: cardId,
      },
      include: {
        note: true,
      },
    });

    if (
      card === null ||
      isAfter(card.nextReviewAt, new Date()) ||
      card.stage === LEGENDARY
    ) {
      return;
    }

    const correctNewStage = card.stage + 1;
    const newStage =
      card.wrongStreak > 0
        ? Math.max(NOVICE_1, card.stage - 1)
        : correctNewStage;

    const nextReviewAt =
      newStage < INTERMEDIATE_1
        ? roundToHour(
            add(
              new Date(),
              INTERVALS[newStage] ?? {
                weeks: 1,
              },
            ),
          )
        : roundToHour(
            add(
              add(
                new Date(),
                INTERVALS[newStage] ?? {
                  weeks: 1,
                },
              ),
              {
                days: Math.floor(Math.random() * (FUZZ[newStage] ?? 3)),
              },
            ),
          );

    if (newStage >= INTERMEDIATE_1 && !card.passed) {
      await this.db.card.update({
        where: {
          id: cardId,
        },
        data: {
          passed: true,
          stage: newStage,
          nextReviewAt,
          wrongStreak: 0,
        },
      });
    } else {
      await this.db.card.update({
        where: {
          id: cardId,
        },
        data: {
          stage: newStage,
          nextReviewAt,
          wrongStreak: 0,
        },
      });
    }
  }

  /**
   * Mark a given card as incorrectly answered.
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

    if (
      card === null ||
      isAfter(card.nextReviewAt, new Date()) ||
      card.stage === LEGENDARY
    ) {
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
        lastWrong: new Date(),
      },
    });
  }
}
