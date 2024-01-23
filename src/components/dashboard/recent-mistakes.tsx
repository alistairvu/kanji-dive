"use client";

import { type CardWithNote } from "types/quiz";
import { buttonVariants } from "../ui/button";
import { ItemCard } from "./item-card";
import { api } from "@/trpc/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type RecentMistakesProps = {
  cards: CardWithNote[];
};

export function RecentMistakes({ cards }: RecentMistakesProps) {
  const recentMistakesQuery = api.recents.getRecentMistakes.useQuery(
    undefined,
    {
      initialData: cards,
    },
  );

  return (
    <div className="rounded-md border border-slate-100 p-4 shadow-md">
      <h4 className="text-2xl font-semibold">Recent Mistakes</h4>
      <p className="my-2">
        Here are some of your mistakes from the last 24 hours.
      </p>

      <div className="mt-2 flex shrink flex-wrap items-start justify-start gap-2">
        {recentMistakesQuery.data.slice(0, 10).map((x) => (
          <ItemCard key={x.id} note={x.note} />
        ))}
      </div>

      <Link
        className={cn(buttonVariants({ variant: "default" }), "mt-2")}
        href="/recent-mistakes"
      >
        Practice ({recentMistakesQuery.data.length})
      </Link>
    </div>
  );
}
