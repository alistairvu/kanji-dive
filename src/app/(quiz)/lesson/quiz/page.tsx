import { LessonQuizSlides } from "@/components/lesson/lesson-quiz-slides";
import { api } from "@/trpc/server";
import { shuffleArray } from "@/utils/shuffle";
import { redirect } from "next/navigation";

export default async function Page() {
  const cards = await api.lesson.getNextLesson.query();
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
  }));

  return <LessonQuizSlides cards={slideCards} />;
}
