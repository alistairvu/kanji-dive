import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ReviewController } from "../controllers/review.controller";
import { z } from "zod";

export const reviewRouter = createTRPCRouter({
  countLearned: protectedProcedure.query(async ({ ctx }) => {
    const service = new ReviewController(ctx.db);
    return service.countLearned(ctx.session.user.id);
  }),

  countReviews: protectedProcedure.query(async ({ ctx }) => {
    const service = new ReviewController(ctx.db);
    return service.countReviews(ctx.session.user.id);
  }),

  forecastReviews: protectedProcedure.query(async ({ ctx }) => {
    const service = new ReviewController(ctx.db);
    return service.forecastReviews(ctx.session.user.id);
  }),

  getReviews: protectedProcedure.query(async ({ ctx }) => {
    const service = new ReviewController(ctx.db);
    return service.getReviews(ctx.session.user.id);
  }),

  getNextReviewTime: protectedProcedure.query(async ({ ctx }) => {
    const service = new ReviewController(ctx.db);
    return service.getNextReviewTime(ctx.session.user.id);
  }),

  markAsCorrect: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const service = new ReviewController(ctx.db);

      return service.markAsCorrect({
        userId: ctx.session.user.id,
        cardId: input,
      });
    }),

  markAsIncorrect: protectedProcedure
    .input(
      z.object({
        cardId: z.string(),
        incorrectCount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new ReviewController(ctx.db);

      return service.markAsIncorrect({
        userId: ctx.session.user.id,
        cardId: input.cardId,
      });
    }),
});
