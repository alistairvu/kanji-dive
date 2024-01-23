import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { CardController } from "../controllers/card.controller";
import { z } from "zod";

export const cardRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const controller = new CardController(ctx.db);
    return controller.get(ctx.session.user.id);
  }),

  find: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .query(async ({ ctx, input }) => {
      const controller = new CardController(ctx.db);
      return controller.find(input.cardId, ctx.session.user.id);
    }),

  create: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const controller = new CardController(ctx.db);
      return controller.create(input.noteId, ctx.session.user.id);
    }),

  createMany: protectedProcedure
    .input(z.object({ noteIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const controller = new CardController(ctx.db);
      return controller.createMany(input.noteIds, ctx.session.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .query(async ({ ctx, input }) => {
      const controller = new CardController(ctx.db);
      return controller.delete(input.cardId, ctx.session.user.id);
    }),
});
