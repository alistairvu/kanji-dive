import { cn } from "@/lib/utils";
import { getColour } from "@/utils/get-colour";
import { type Note } from "@prisma/client";
import Link from "next/link";
import { Plus } from "lucide-react";

type KanjiComponentsProps = {
  components: Note[];
};

export function KanjiComponents({ components }: KanjiComponentsProps) {
  return (
    <div className="space-y-4 rounded-sm border p-4 shadow-sm">
      <div className="text-3xl font-semibold">Components</div>

      <div className="my-2 flex flex-wrap items-center justify-start gap-2">
        {components.map((note, index) => (
          <div className="flex items-center gap-2" key={note.id}>
            <Link href={`/note/${note.id}`}>
              <div
                className={cn(
                  "flex h-12 w-12 min-w-0 flex-col items-center justify-center rounded-sm px-2 font-noto text-4xl text-slate-50 shadow-sm",
                  getColour(note.type),
                )}
              >
                <h4 className="text-3xl">{note.character}</h4>
              </div>
            </Link>

            <p className="text-lg">{note.meanings[0]}</p>

            {index + 1 < components.length && (
              <Plus className="h-6 w-6 text-slate-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
