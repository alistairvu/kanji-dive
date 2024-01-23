import { createTRPCRouter } from "@/server/api/trpc";
import { lessonRouter } from "./routers/lesson.router";
import { reviewRouter } from "./routers/review.router";
import { noteRouter } from "./routers/note.router";
import { recentsRouter } from "./routers/recents.router";
import { kanjiRouter } from "./routers/kanji.router";
import { searchRouter } from "./routers/search.router";
import { cardRouter } from "./routers/card.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  card: cardRouter,
  lesson: lessonRouter,
  review: reviewRouter,
  note: noteRouter,
  recents: recentsRouter,
  kanji: kanjiRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
