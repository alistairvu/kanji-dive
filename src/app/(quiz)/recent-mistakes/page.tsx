import { PracticeQuizSlides } from "@/components/practice/practice-quiz-slides";
import { api } from "@/trpc/server";
import { shuffleArray } from "@/utils/shuffle";
import { redirect } from "next/navigation";

export default async function Page() {
  const cards = await api.recents.getRecentMistakes.query();
  shuffleArray(cards);

  const firstCard = cards[0];

  if (firstCard === undefined) {
    redirect("/dashboard");
  }

  const slideCards = cards.map((x) => ({
    ...x,
    isReadingIncorrect: false,
    isMeaningIncorrect: false,
    localWrongStreak: 0,
    localStage: x.stage,
    testingReading: Math.random() > 0.5,
    correctCount: 0,
  }));

  shuffleArray(slideCards);

  return (
    <PracticeQuizSlides
      cards={slideCards.slice(0, 25)}
      toastMessage={
        slideCards.length > 25
          ? `Practicing 25 random mistakes.`
          : `Practicing all ${slideCards.length} recent mistakes.`
      }
    />
  );
}
