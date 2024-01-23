import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { SearchController } from "../controllers/search.controller";

export const searchRouter = createTRPCRouter({
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const controller = new SearchController(ctx.db);
    return controller.search(input);
  }),
});
