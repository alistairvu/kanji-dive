"use client";

import { NoteType } from "@prisma/client";
import React, {
  useRef,
  type Dispatch,
  type SetStateAction,
  useEffect,
  createContext,
  useContext,
} from "react";
import clsx from "clsx";
import { type AnswerState } from "./answer-state";
import { getColour } from "@/utils/get-colour";
import { toHiragana } from "wanakana";
import { QuizItemStatus } from "./quiz-item-status";
import { type CardWithStatus } from "types/quiz";
import { useMediaQuery } from "usehooks-ts";
import FocusLock from "react-focus-lock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type QuizItemProps = {
  card: CardWithStatus;
  handleNext: () => void;
  handleUndo: () => void;

  answerState: AnswerState;
  showInfo: boolean;

  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;

  testingReading?: boolean;
  showStatus?: boolean;

  verifyAnswer: () => boolean;
};

const QuizItemContext = createContext<QuizItemProps | null>(null);

export function QuizItem(props: QuizItemProps) {
  const { answerState, showInfo } = props;

  return (
    <QuizItemContext.Provider value={props}>
      <div className="my-2 grid h-[24rem] grid-rows-3 gap-2 md:h-[28rem]">
        {/** Question Display */}
        <QuizItemDisplay />
        {/** Answer display */}
        <QuizItemInput />
      </div>

      {(answerState === "INCORRECT" ||
        (answerState === "CORRECT" && showInfo)) && <QuizItemInfo />}
    </QuizItemContext.Provider>
  );
}

/**
 * Displays a quiz item
 *
 * @returns Quiz item.
 */
function QuizItemDisplay() {
  const context = useContext(QuizItemContext);

  if (context === null) {
    return null;
  }

  const { card, showStatus } = context;
  const { note } = card;

  return (
    <div
      className={clsx(
        "row-span-2 flex flex-col items-center rounded shadow-sm",
        getColour(note.type),
      )}
    >
      <div className="mt-2 text-center">
        {showStatus && <QuizItemStatus stage={card.localStage} />}
      </div>

      <div className="flex grow items-center justify-center px-2">
        <h4
          className={`${
            note.type != NoteType.VOCAB
              ? "text-7xl md:text-9xl"
              : "text-5xl md:text-7xl"
          } text-center font-noto drop-shadow-sm`}
        >
          {note.character}
        </h4>
      </div>

      <div className="mb-2 text-center">
        <h4 className={`font-semibold drop-shadow-sm md:text-xl`}>
          {note.type === NoteType.VOCAB ? "VOCABULARY" : note.type}
        </h4>
      </div>
    </div>
  );
}

function QuizItemInput() {
  const context = useContext(QuizItemContext);

  if (context === null) {
    return null;
  }

  const {
    answer,
    setAnswer,
    answerState,
    testingReading,
    handleNext,
    handleUndo,
  } = context;

  const inputElement = useRef<null | HTMLInputElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Updates answer
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (answerState === "ANSWERING") {
      const target = e.target as HTMLInputElement;

      if (testingReading) {
        setAnswer(
          toHiragana(target.value, {
            IMEMode: "toHiragana",
          }),
        );
      } else {
        setAnswer(target.value);
      }
    }
  };

  // Hello
  const handleKeyUp: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === "Enter") {
      handleNext();
    }

    if (answerState === "INCORRECT" && e.key === "Backspace") {
      handleUndo();
    }
  };

  // Automatically scroll when needed
  const handleScroll = () => {
    setTimeout(() => {
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTop = 0;
      }
    }, 250);
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.addEventListener("click", handleScroll);
      inputElement.current.addEventListener("focus", handleScroll);
    }

    return () => {
      if (inputElement.current) {
        inputElement.current.addEventListener("click", handleScroll);
        inputElement.current.removeEventListener("focus", handleScroll);
      }
    };
  });

  useEffect(() => {
    if (answerState === "ANSWERING") {
      inputElement.current?.click();
    }

    if (
      !isDesktop &&
      answerState === "INCORRECT" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  }, [answerState]);

  useEffect(() => {
    inputElement.current?.click();
    handleScroll();
  }, []);

  return (
    <div className="relative row-span-1 w-full">
      <label
        className={clsx(
          "absolute top-1 z-10 inline-grid w-full text-center text-sm font-semibold transition-opacity",
          testingReading
            ? {
                "text-slate-200": answerState === "ANSWERING",
                "text-green-200": answerState === "CORRECT",
                "text-red-200": answerState === "INCORRECT",
              }
            : {
                "text-slate-700": answerState === "ANSWERING",
                "text-green-700": answerState === "CORRECT",
                "text-red-700": answerState === "INCORRECT",
              },
        )}
      >
        {testingReading ? "READING" : "MEANING"}
      </label>

      <FocusLock
        disabled={!isDesktop && answerState === "INCORRECT"}
        className="h-full w-full"
      >
        <input
          className={clsx(
            "relative h-full w-full rounded-md text-center text-3xl outline-none focus:ring",
            testingReading
              ? {
                  "bg-slate-800 ring-slate-600": answerState === "ANSWERING",
                  "bg-green-800 ring-green-600": answerState === "CORRECT",
                  "bg-red-800 ring-red-600": answerState === "INCORRECT",
                }
              : {
                  "bg-slate-200 ring-slate-400": answerState === "ANSWERING",
                  "bg-green-200 ring-green-400": answerState === "CORRECT",
                  "bg-red-200 ring-red-400": answerState === "INCORRECT",
                },
            testingReading ? "font-noto text-slate-100" : "text-slate-900",
          )}
          placeholder={testingReading ? "Any Reading..." : "Any Meaning..."}
          autoComplete="off"
          value={answer}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          ref={inputElement}
        />
      </FocusLock>
    </div>
  );
}

function QuizItemInfo() {
  const context = useContext(QuizItemContext);

  if (context === null) {
    return null;
  }

  const { card, testingReading } = context;
  const { note } = card;

  return (
    <div className="mt-2 rounded-sm border p-4 shadow-sm">
      <Accordion
        type="multiple"
        defaultValue={[testingReading ? "reading" : "meaning"]}
      >
        <AccordionItem value="meaning">
          <AccordionTrigger>Meaning</AccordionTrigger>
          <AccordionContent>
            <h4 className={clsx("text-2xl font-semibold")}>
              {note.meanings.join(", ")}
            </h4>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reading" className="border-b-0">
          <AccordionTrigger>Reading</AccordionTrigger>
          <AccordionContent>
            {note.type === NoteType.KANJI ? (
              <>
                <h4 className={clsx("font-noto text-2xl font-semibold")}>
                  On: {note.readingsOn.join(", ")}
                </h4>

                <h4 className={clsx("font-noto text-2xl font-semibold")}>
                  Kun: {note.readingsKun.join(", ")}
                </h4>
              </>
            ) : (
              <h4 className={clsx("font-noto text-2xl font-semibold")}>
                {note.readings.join(", ")}
              </h4>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
