"use client";

import { type Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LessonItem } from "./lesson-item";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";

type CardWithNote = Prisma.CardGetPayload<{
  include: { note: true };
}>;

type LessonSlideProps = {
  cards: CardWithNote[];
};

export function LessonSlides({ cards }: LessonSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCard = cards[currentIndex];
  const router = useRouter();

  // NextItem
  function goToPreviousCard() {
    if (currentIndex === 0) {
      router.push("/dashboard");
    } else {
      setCurrentIndex((current) => current - 1);
    }
  }

  // NextItem
  function goToNextCard() {
    if (currentIndex + 1 >= cards.length) {
      router.push("/lesson/quiz");
    } else {
      setCurrentIndex((current) => current + 1);
    }
  }

  useEffect(() => {
    const enterListener = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        goToNextCard();
      }
    };

    window.addEventListener("keyup", enterListener);

    return () => {
      window.removeEventListener("keyup", enterListener);
    };
  });

  useEffect(() => {
    console.log("scrolling");
    document.documentElement.scrollTop = 0;
  }),
    [currentIndex];

  if (currentCard === undefined) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
        <Progress
          value={cards.length === 0 ? 100 : (currentIndex / cards.length) * 100}
        />
      </div>

      <LessonItem note={currentCard.note} />
      <div className="my-2 flex items-center justify-between">
        <Button variant="outline" onClick={goToPreviousCard}>
          Back
        </Button>
        <Button onClick={goToNextCard}>Next</Button>
      </div>
    </div>
  );
}
