import { cn } from "@/lib/utils";
import { getColour } from "@/utils/get-colour";
import { type Note } from "@prisma/client";
import Link from "next/link";

type FoundInProps = {
  foundIn: Note[];
};

export function FoundIn({ foundIn }: FoundInProps) {
  return (
    <div className="space-y-4 rounded-sm border p-4 shadow-sm">
      <div className="text-3xl font-semibold">Found In</div>

      {foundIn.length > 0 ? (
        foundIn.map((note) => (
          <Link key={note.id} href={`/note/${note.id}`} className="my-1">
            <div
              className={cn(
                "my-2 flex h-16 min-w-0 items-center justify-between rounded-sm px-2 font-noto text-4xl text-slate-50 shadow-sm",
                getColour(note.type),
              )}
            >
              <h4 className="font-noto text-4xl">{note.character}</h4>
              <div className="text-right text-lg">
                <h5 className="font-sans">{note.meanings[0]}</h5>
                <h5 className="font-noto">{note.readings[0]}</h5>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>Not found in any items.</p>
      )}
    </div>
  );
}
