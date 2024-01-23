import { AddItems } from "@/components/dashboard/add-items";
import { ExtraStudy } from "@/components/dashboard/extra-study";
import { NoteStages } from "@/components/dashboard/note-stages";
import { NowAvailable } from "@/components/dashboard/now-available";
import { RecentMistakes } from "@/components/dashboard/recent-mistakes";
import { ReviewForecast } from "@/components/dashboard/review-forecast";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();

  if (session === null) {
    redirect("/api/auth/signin");
  }

  const initialLessons = await api.lesson.countLessons.query();
  const initialReviews = await api.review.countReviews.query();
  const initialNextReview = await api.review.getNextReviewTime.query();

  const initialRecentMistakes = await api.recents.getRecentMistakes.query();
  const initialRecentLessons = await api.recents.getRecentLessons.query();

  const initialLearnedKanji = await api.kanji.countLearned.query();

  return (
    <main className="container py-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <NowAvailable
            session={session}
            initialLessons={initialLessons}
            initialReviews={initialReviews}
            initialNextReview={initialNextReview}
            initialLearnedKanji={initialLearnedKanji}
          />

          {initialRecentMistakes.length > 0 && (
            <div className="my-4">
              <RecentMistakes cards={initialRecentMistakes} />
            </div>
          )}

          {initialRecentLessons.length > 0 && (
            <div className="my-4">
              <ExtraStudy cards={initialRecentLessons} />
            </div>
          )}

          <div className="my-4">
            <AddItems />
          </div>
        </div>

        <div className="grid-cols-1">
          <ReviewForecast />
          <NoteStages />
        </div>
      </div>
    </main>
  );
}
