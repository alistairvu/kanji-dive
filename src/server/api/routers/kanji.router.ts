import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { KanjiController } from "../controllers/kanji.controller";

export const kanjiRouter = createTRPCRouter({
  countLearned: protectedProcedure.query(async ({ ctx }) => {
    const controller = new KanjiController(ctx.db);
    return controller.countLearned(ctx.session.user.id);
  }),
});
