import { INTERMEDIATE_1 } from "@/constants/steps";
import clsx from "clsx";

type ItemProgressProps = {
  level: number;
  passed?: boolean;
  max?: number;
  className?: string;
};

export function ItemProgress({
  level,
  passed,
  max = INTERMEDIATE_1,
  className,
}: ItemProgressProps) {
  if (passed) {
    return (
      <div
        className={clsx("mt-1 h-1 w-full rounded-sm bg-green-500", className)}
      />
    );
  }

  return (
    <div className="mt-1 flex gap-[1px]">
      {Array.from(Array(max).keys()).map((item) => (
        <div
          className={clsx(
            "h-1 w-full",
            level > item ? "bg-green-500" : "bg-slate-500",
            {
              "rounded-l-sm": item === 0,
              "rounded-r-sm": item === max - 1,
            },
            className,
          )}
          key={item}
        />
      ))}
    </div>
  );
}
