import { type PrismaClient } from "@prisma/client";
import { sub } from "date-fns";

export class RecentController {
  constructor(private db: PrismaClient) {}

  /**
   * Get items a specific user has learned within the last 24 hours.
   */
  async getRecentLessons(userId: string) {
    return this.db.card.findMany({
      where: {
        userId,
        passed: false,
        stage: {
          gt: 0,
        },
      },
      include: {
        note: true,
      },
      orderBy: {
        learnedAt: "desc",
      },
    });
  }

  /**
   * Get items a specific user has learned within the last 24 hours.
   */
  async getRecentMistakes(userId: string) {
    return this.db.card.findMany({
      where: {
        userId,
        lastWrong: {
          gte: sub(new Date(), { hours: 24 }),
        },
      },
      include: {
        note: true,
      },
      orderBy: {
        lastWrong: "desc",
      },
    });
  }
}
