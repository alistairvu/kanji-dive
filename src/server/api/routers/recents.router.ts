import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { RecentController } from "../controllers/recents.controller";

export const recentsRouter = createTRPCRouter({
  getRecentLessons: protectedProcedure.query(async ({ ctx }) => {
    const controller = new RecentController(ctx.db);
    return controller.getRecentLessons(ctx.session.user.id);
  }),

  getRecentMistakes: protectedProcedure.query(async ({ ctx }) => {
    const controller = new RecentController(ctx.db);
    return controller.getRecentMistakes(ctx.session.user.id);
  }),
});
