"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuizItem } from "./quiz-item";
import { type AnswerState } from "./answer-state";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Inbox, InfoIcon, LogOut, Undo2Icon } from "lucide-react";
import { toHiragana, toKatakana } from "wanakana";
import { type CardWithStatus } from "types/quiz";
import { api } from "@/trpc/react";
import { distance } from "fastest-levenshtein";
import { NoteType } from "@prisma/client";

type QuizSlidesProps = {
  cards: CardWithStatus[];
  showCardStage?: boolean;
  registerCorrect?: (cardId: string) => Promise<void>;
  registerIncorrect?: (cardId: string, incorrectCount: number) => Promise<void>;
  isPractice?: boolean;
};

export function QuizSlides({
  cards,
  registerCorrect,
  registerIncorrect,
  showCardStage,
  isPractice,
}: QuizSlidesProps) {
  const [queue, setQueue] = useState(cards);

  const router = useRouter();

  const [answerState, setAnswerState] = useState<AnswerState>("ANSWERING");
  const [answer, setAnswer] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const utils = api.useUtils();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [testingReading, setTestingReading] = useState(false);

  const currentCard = queue[0];

  function handleUndo() {
    // Only enables undo when answer state is incorrect
    if (answerState !== "INCORRECT" || currentCard === undefined) {
      return;
    }

    setAnswer("");
    setAnswerState("ANSWERING");
    setShowInfo(false);
    currentCard.localWrongStreak -= 1;

    if (testingReading) {
      currentCard.isReadingIncorrect = false;
    } else {
      currentCard.isMeaningIncorrect = false;
    }
  }

  // Handles what happens when user presses next
  async function handleNext() {
    if (answer.trim().length === 0) {
      return;
    }

    // Just verifies answer
    if (answerState === "ANSWERING") {
      if (currentCard === undefined) {
        return;
      }

      const correct = verifyAnswer();

      if (correct) {
        setAnswerState("ANSWERING");
        setAnswer("");
        setShowInfo(false);

        // We swap testing type if we're correct
        setTestingReading((val) => !val);

        // If answered correctly, we mark as incorrect
        if (testingReading) {
          // Move to the back if card is incorrectly answered.
          const [first, ...rest] = queue;
          const isIncorrect =
            currentCard.isMeaningIncorrect || currentCard.isReadingIncorrect;
          const newQueue =
            isIncorrect && !isPractice ? [...rest, first!] : [...rest];
          setQueue(newQueue);

          if (isIncorrect) {
            if (registerIncorrect) {
              await registerIncorrect(currentCard.id, 1);
            }
          } else {
            if (registerCorrect) {
              await registerCorrect(currentCard?.id ?? "");
              await utils.lesson.countLessons.invalidate();
              await utils.review.countReviews.invalidate();
            }
          }

          currentCard.isReadingIncorrect = false;
          currentCard.isMeaningIncorrect = false;
        }
      } else {
        setShowInfo(true);
        currentCard.localWrongStreak += 1;

        if (testingReading) {
          currentCard.isReadingIncorrect = true;
        } else {
          currentCard.isMeaningIncorrect = true;
        }

        setAnswerState("INCORRECT");
      }

      return;
    }

    setAnswerState("ANSWERING");
    setAnswer("");
    setShowInfo(false);
  }

  if (currentCard === undefined) {
    router.push("/dashboard");
    router.refresh();
    return null;
  }

  // Get the degree of errors allowed for one question
  const isAccepted = (answer: string, distance: number) => {
    if (answer.length <= 3) return distance === 0;

    if (answer.length <= 5) return distance <= 1;

    if (answer.length <= 7) return distance <= 2;

    return distance <= 2 + Math.floor(answer.length / 7);
  };

  // Answer verification
  const verifyAnswer = () => {
    if (answer.toLowerCase().trim().length === 0) {
      return false;
    }

    // Verifying reading!
    if (testingReading) {
      const hiragana = toHiragana(answer.trim());

      if (currentCard.note.type === NoteType.VOCAB) {
        return currentCard.note.readings
          .map((x) => toHiragana(x))
          .includes(hiragana);
      } else {
        if (
          currentCard.note.readingsKun
            .map((x) => toHiragana(x))
            .includes(hiragana)
        ) {
          return true;
        }

        const katakana = toKatakana(answer.trim());
        return currentCard.note.readingsOn
          .map((x) => toKatakana(x))
          .includes(katakana);
      }
    }

    const allowedMeanings = currentCard.note.meanings.map((x) =>
      x.trim().toLowerCase(),
    );

    if (allowedMeanings.includes(answer.toLowerCase().trim())) {
      return true;
    }

    const trimmedAnswer = answer.toLowerCase().trim();

    const result = allowedMeanings.findIndex((x) =>
      isAccepted(x, distance(x, trimmedAnswer)),
    );
    return result > -1;
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
        >
          <LogOut className="h-4 w-4 rotate-180" />
        </Button>
        <Progress
          value={
            cards.length === 0 ? 100 : 100 - (queue.length / cards.length) * 100
          }
        />

        <div className="flex flex-row items-center justify-center gap-1">
          <Inbox className="h-4 w-4" /> <span>{queue.length}</span>
        </div>
      </div>

      <QuizItem
        card={currentCard}
        handleNext={handleNext}
        handleUndo={handleUndo}
        answerState={answerState}
        answer={answer}
        setAnswer={setAnswer}
        verifyAnswer={verifyAnswer}
        testingReading={testingReading}
        showInfo={showInfo}
        showStatus={showCardStage}
      />

      <div className="mt-2 flex items-center justify-between">
        {answerState === "ANSWERING" ? (
          <div className="w-64" />
        ) : answerState === "INCORRECT" ? (
          <Button
            onClick={() => {
              handleUndo();
            }}
            variant="secondary"
          >
            <Undo2Icon className="mr-2" /> Undo
          </Button>
        ) : (
          <Button
            onClick={() => {
              setShowInfo((val) => !val);
            }}
            variant="secondary"
          >
            <InfoIcon className="mr-2" /> {showInfo ? "Hide Info" : "Show Info"}
          </Button>
        )}

        <Button onClick={handleNext}>
          {answerState === "ANSWERING" ? "Check" : "Next"}
        </Button>
      </div>
    </>
  );
}
