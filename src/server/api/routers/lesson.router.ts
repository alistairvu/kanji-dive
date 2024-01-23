import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { LessonController } from "../controllers/lesson.controller";
import { z } from "zod";

export const lessonRouter = createTRPCRouter({
  countLessons: protectedProcedure.query(async ({ ctx }) => {
    const controller = new LessonController(ctx.db);
    return controller.countLessons(ctx.session.user.id);
  }),

  getNextLesson: protectedProcedure.query(async ({ ctx }) => {
    const controller = new LessonController(ctx.db);
    return controller.getNextLesson(ctx.session.user.id);
  }),

  markAsLearned: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const controller = new LessonController(ctx.db);
      return controller.markAsLearned({
        userId: ctx.session.user.id,
        cardId: input,
      });
    }),

  markAsIncorrect: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const controller = new LessonController(ctx.db);
      return controller.markAsIncorrect({
        userId: ctx.session.user.id,
        cardId: input,
      });
    }),
});
