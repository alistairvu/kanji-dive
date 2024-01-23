import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { NoteRouter } from "../controllers/note.controller";
import { z } from "zod";

export const noteRouter = createTRPCRouter({
  find: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const noteService = new NoteRouter(ctx.db);
    return noteService.find(input);
  }),

  findKanjisToCreate: protectedProcedure
    .input(z.object({ kanji: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const noteService = new NoteRouter(ctx.db);
      return noteService.findKanjisToCreate(input.kanji, ctx.session?.user.id);
    }),

  findVocabToCreate: protectedProcedure
    .input(z.object({ vocab: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const noteService = new NoteRouter(ctx.db);
      return noteService.findVocabToCreate(input.vocab, ctx.session?.user.id);
    }),

  findCardWithNote: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const noteService = new NoteRouter(ctx.db);

      if (ctx.session === null) {
        return null;
      }

      return noteService.findCardWithNote(ctx.session.user.id, input);
    }),

  get: publicProcedure.query(async ({ ctx }) => {
    const noteService = new NoteRouter(ctx.db);
    return noteService.get();
  }),

  countByStage: protectedProcedure.query(async ({ ctx }) => {
    const noteService = new NoteRouter(ctx.db);
    return noteService.countByStage(ctx.session.user.id);
  }),
});
