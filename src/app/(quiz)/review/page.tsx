import { ReviewQuizSlides } from "@/components/review/review-quiz-slides";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { shuffleArray } from "@/utils/shuffle";

export default async function Page() {
  const cards = await api.review.getReviews.query();
  shuffleArray(cards);

  const firstCard = cards[0];

  if (firstCard === undefined) {
    redirect("/dashboard");
  }

  const slideCards = cards.map((x) => ({
    ...x,
    isReadingIncorrect: false,
    isMeaningIncorrect: false,
    localWrongStreak: x.wrongStreak,
    localStage: x.stage,
  }));

  return <ReviewQuizSlides cards={slideCards} />;
}
