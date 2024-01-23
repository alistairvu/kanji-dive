"use client";

import {
  ADVANCED,
  INTERMEDIATE_1,
  INTERMEDIATE_2,
  LEGENDARY,
  NOVICE_1,
  NOVICE_3,
  PROFESSIONAL,
} from "@/constants/steps";
import { api } from "@/trpc/react";
import { type Card } from "@prisma/client";
import { formatDistanceToNowStrict, isBefore } from "date-fns";
import { calculateName } from "@/utils/calculate-stage";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type ProgressDisplayProps = {
  initialCard: Card | null;
  noteId: number;
};

export function ProgressDisplay({ initialCard, noteId }: ProgressDisplayProps) {
  const cardQuery = api.note.findCardWithNote.useQuery(noteId, {
    initialData: initialCard,
  });
  const { data: card } = cardQuery;
  const router = useRouter();

  const addCardMutation = api.card.create.useMutation({
    onSuccess: () => {
      toast.success("Created card");
      router.push("/lesson");
    },
  });

  if (card === null) {
    return (
      <div className="text-center">
        <p className="text-center text-lg">You haven't added this item yet.</p>

        <Button
          disabled={addCardMutation.isLoading}
          onClick={() => {
            addCardMutation.mutate({ noteId });
          }}
        >
          <Plus className="mr-2" />
          Create Card
        </Button>
      </div>
    );
  }

  if (card.stage === 0) {
    return <p className="text-center text-lg">Card not in review queue.</p>;
  }

  // Generates the text below the progress bar
  function getProgressText() {
    if (card === null) return "";

    if (isBefore(card.nextReviewAt, new Date())) {
      return "Available for review now";
    }

    if (card.stage === LEGENDARY) {
      return "This item is legendary! You won't see this items in reviews.";
    }

    return `Available for review ${formatDistanceToNowStrict(
      card.nextReviewAt,
      {
        addSuffix: true,
        roundingMethod: "round",
      },
    )}.`;
  }

  return (
    <div className="text-center text-2xl">
      <h2 className="text-2xl font-semibold">{calculateName(card.stage)}</h2>
      <div className="my-2 flex gap-1">
        {[...new Array(LEGENDARY).keys()].map((x) => (
          <div
            className={cn(
              "h-2 w-full rounded-full border-2",
              {
                "border-pink-600": x + 1 >= NOVICE_1 && x + 1 <= NOVICE_3,
                "border-purple-600":
                  x + 1 >= INTERMEDIATE_1 && x + 1 <= INTERMEDIATE_2,
                "border-blue-600": x + 1 === ADVANCED,
                "border-sky-600": x + 1 === PROFESSIONAL,
                "border-blue-950": x + 1 === LEGENDARY,
              },
              x < card.stage && {
                "bg-pink-600": x + 1 >= NOVICE_1 && x + 1 <= NOVICE_3,
                "bg-purple-600":
                  x + 1 >= INTERMEDIATE_1 && x + 1 <= INTERMEDIATE_2,
                "bg-blue-600": x + 1 === ADVANCED,
                "bg-sky-600": x + 1 === PROFESSIONAL,
                "bg-blue-950": x + 1 === LEGENDARY,
              },
            )}
            key={x}
          />
        ))}
      </div>

      <h3 className="text-lg">{getProgressText()}</h3>
    </div>
  );
}
