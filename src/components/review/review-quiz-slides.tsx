"use client";

import { api } from "@/trpc/react";
import { QuizSlides } from "../quiz/quiz-slides";
import { type CardWithStatus } from "types/quiz";

type ReviewQuizSlidesProps = {
  cards: CardWithStatus[];
};

export function ReviewQuizSlides({ cards }: ReviewQuizSlidesProps) {
  const registerCorrectMutation = api.review.markAsCorrect.useMutation();
  const registerIncorrectMutation = api.review.markAsIncorrect.useMutation();

  const registerCorrect = async (cardId: string) => {
    await registerCorrectMutation.mutateAsync(cardId);
  };

  const registerIncorrect = async (cardId: string, incorrectCount: number) => {
    await registerIncorrectMutation.mutateAsync({ cardId, incorrectCount });
  };

  return (
    <QuizSlides
      cards={cards}
      registerCorrect={registerCorrect}
      registerIncorrect={registerIncorrect}
      showCardStage={true}
    />
  );
}
