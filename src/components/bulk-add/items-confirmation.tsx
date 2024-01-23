"use client";

import { getColour } from "@/utils/get-colour";
import { NoteType, type Note } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export function ItemsConfirmation(props: { items: Note[] }) {
  const { items } = props;

  const router = useRouter();
  const bulkCreateMutation = api.card.createMany.useMutation({
    onSuccess(data) {
      toast.success(`Created ${data.count} item${data.count !== 1 ? "s" : ""}`);
      router.push("/lesson");
    },
  });

  const [selected, setSelected] = useState(
    items.map((x) => ({
      id: x.id,
      selected: true,
    })),
  );

  const handleCheckedChange = (id: number, status: boolean) => {
    setSelected((currentSelected) =>
      currentSelected.map((x) => {
        if (x.id !== id) return x;

        return { ...x, selected: status };
      }),
    );
  };

  const handleAddItems = async () => {
    const addIds = selected.filter((x) => x.selected).map((x) => x.id);
    await bulkCreateMutation.mutateAsync({ noteIds: addIds });
  };

  return (
    <div className="my-4">
      <p className="my-2">
        The following items can be added to your lessons. Check items you want
        to add, or uncheck items you do not want to add.
      </p>

      {items.map((note) => (
        <div className="flex items-center gap-x-2" key={note.id}>
          <Checkbox
            className="h-6 w-6"
            checked={selected.find((x) => x.id === note.id)?.selected}
            onCheckedChange={(checked) => {
              handleCheckedChange(
                note.id,
                typeof checked === "string" ? false : checked,
              );
            }}
          />

          <Link href={`/note/${note.id}`} className="grow">
            <div
              className={clsx(
                "mb-2 flex h-16 w-full grow items-center justify-between rounded-sm px-4 text-4xl shadow-sm",
                getColour(note.type),
              )}
            >
              <h4 className="font-noto text-3xl">{note.character}</h4>

              <div className="text-right text-lg">
                <h5 className="font-sans">{note.meanings[0]}</h5>
                {note.type === NoteType.VOCAB && (
                  <h5 className="font-noto">{note.readings[0]}</h5>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}

      <Button onClick={handleAddItems} disabled={bulkCreateMutation.isLoading}>
        <Plus className="mr-2" /> Add Items
      </Button>
    </div>
  );
}
