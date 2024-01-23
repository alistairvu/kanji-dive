"use client";

import { useEffect } from "react";
import { QuizSlides } from "../quiz/quiz-slides";
import { type CardWithStatus } from "types/quiz";
import { toast } from "sonner";

type PracticeQuizSlidesProps = {
  cards: CardWithStatus[];
  toastMessage?: string;
};

export function PracticeQuizSlides({
  cards,
  toastMessage,
}: PracticeQuizSlidesProps) {
  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage);
    }
  }, []);

  return <QuizSlides cards={cards} isPractice />;
}
