import {
  ADVANCED,
  INTERMEDIATE_1,
  INTERMEDIATE_2,
  LEGENDARY,
  NOVICE_1,
  NOVICE_3,
  PROFESSIONAL,
} from "@/constants/steps";
import { cn } from "@/lib/utils";

type QuizItemStatusProps = {
  stage: number;
};

export function QuizItemStatus({ stage }: QuizItemStatusProps) {
  return (
    <div className="flex gap-1 rounded-full bg-slate-100 p-1 shadow-md">
      {[...new Array(LEGENDARY).keys()].map((x) => (
        <div
          className={cn(
            "h-1 w-4 rounded-full border",
            {
              "border-pink-600": x + 1 >= NOVICE_1 && x + 1 <= NOVICE_3,
              "border-purple-600":
                x + 1 >= INTERMEDIATE_1 && x + 1 <= INTERMEDIATE_2,
              "border-blue-600": x + 1 === ADVANCED,
              "border-sky-600": x + 1 === PROFESSIONAL,
              "border-blue-950": x + 1 === LEGENDARY,
            },
            x < stage && {
              "bg-pink-600": x + 1 >= NOVICE_1 && x + 1 <= NOVICE_3,
              "bg-purple-600":
                x + 1 >= INTERMEDIATE_1 && x + 1 <= INTERMEDIATE_2,
              "bg-blue-600": x + 1 === ADVANCED,
              "bg-sky-600": x + 1 === PROFESSIONAL,
              "bg-blue-950": x + 1 === LEGENDARY,
            },
          )}
          key={x}
        ></div>
      ))}
    </div>
  );
}
