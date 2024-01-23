"use client";

import { type CardWithNote } from "types/quiz";
import { api } from "@/trpc/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

type ExtraStudyProps = {
  cards: CardWithNote[];
};

export function ExtraStudy({ cards }: ExtraStudyProps) {
  const recentLessonsQuery = api.recents.getRecentLessons.useQuery(undefined, {
    initialData: cards,
    refetchInterval: 60000,
  });

  return (
    <div className="rounded-md border border-slate-100 p-4 shadow-md">
      <h4 className="text-2xl font-semibold">Extra Study</h4>
      <p className="my-2">Practice your most recent lessons here.</p>

      <Link
        className={cn(buttonVariants({ variant: "default" }), "mt-2")}
        href="/extra-study"
      >
        Practice ({recentLessonsQuery.data.length})
      </Link>
    </div>
  );
}
