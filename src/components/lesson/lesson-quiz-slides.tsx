"use client";

import { api } from "@/trpc/react";
import { QuizSlides } from "../quiz/quiz-slides";
import { type CardWithStatus } from "types/quiz";

type LessonQuizSlidesProps = {
  cards: CardWithStatus[];
};

export function LessonQuizSlides({ cards }: LessonQuizSlidesProps) {
  const registerLearnedMutation = api.lesson.markAsLearned.useMutation();
  const registerIncorrectMutation = api.lesson.markAsIncorrect.useMutation();

  const registerCorrect = async (cardId: string) => {
    await registerLearnedMutation.mutateAsync(cardId);
  };

  const registerIncorrect = async (cardId: string) => {
    await registerIncorrectMutation.mutateAsync(cardId);
  };

  return (
    <QuizSlides
      cards={cards}
      registerCorrect={registerCorrect}
      registerIncorrect={registerIncorrect}
    />
  );
}
