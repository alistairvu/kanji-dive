import { cn } from "@/lib/utils";
import { getColour } from "@/utils/get-colour";
import { type Note, NoteType } from "@prisma/client";
import Link from "next/link";

type ItemCardProps = {
  note: Note;
};

export function ItemCard({ note }: ItemCardProps) {
  return (
    <Link href={`/note/${note.id}`}>
      <div
        className={cn(
          "flex h-12 items-center justify-center rounded-sm px-2 font-noto text-3xl shadow-sm",
          getColour(note.type),
          note.type !== NoteType.VOCAB && "w-12",
        )}
      >
        <p>{note.character}</p>
      </div>
    </Link>
  );
}
