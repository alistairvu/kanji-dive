import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { NoteType } from "@prisma/client";
import clsx from "clsx";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { getColour } from "@/utils/get-colour";
import { ProgressDisplay } from "@/components/note/progress-display";
import { FoundIn } from "@/components/note/found-in";
import { KanjiComponents } from "@/components/note/kanji-components";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const session = await getServerAuthSession();

  if (isNaN(Number(id))) {
    notFound();
  }

  const note = await api.note.find.query(Number(id));

  if (note === null) {
    notFound();
  }

  const card = await api.note.findCardWithNote.query(Number(id));

  return (
    <div className="container my-4 grid gap-2 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={clsx(
              "flex h-16 items-center justify-center rounded-sm px-4 font-noto text-4xl",
              getColour(note.type),
              note.type !== NoteType.VOCAB && "w-16",
            )}
          >
            <p>{note.character}</p>
          </div>

          <h1 className="text-4xl">{note.meanings[0]}</h1>
        </div>

        {note.type === NoteType.VOCAB && (
          <div className="mt-2">
            <KanjiComponents components={note.components} />
          </div>
        )}

        <div className="mt-2 space-y-4 rounded-sm border p-4 shadow-sm">
          <div>
            <h4 className="text-2xl font-semibold">Meanings</h4>
            <h3 className="text-xl font-semibold">
              {note.meanings.join(", ")}
            </h3>
          </div>

          <hr />
          <div>
            <h4 className="text-2xl font-semibold">Readings</h4>

            {note.type === NoteType.KANJI ? (
              <>
                <h3 className={clsx("font-noto text-xl font-semibold")}>
                  On: {note.readingsOn.join(", ")}
                </h3>

                <h3 className={clsx("font-noto text-xl font-semibold")}>
                  Kun: {note.readingsKun.join(", ")}
                </h3>
              </>
            ) : (
              <h3 className={clsx("font-noto text-xl font-semibold")}>
                {note.readings.join(", ")}
              </h3>
            )}
          </div>
        </div>

        {note.type !== NoteType.VOCAB && (
          <div className="mt-2">
            <FoundIn foundIn={note.foundIn} />
          </div>
        )}
      </div>

      <div className="col-span-1">
        <div className="rounded-sm border p-4 shadow-sm">
          {session === null ? (
            <p>
              <Link
                href="/api/auth/signin"
                className="text-violet-600 hover:underline"
              >
                Sign in with Discord
              </Link>{" "}
              to get started.
            </p>
          ) : (
            <ProgressDisplay initialCard={card} noteId={Number(id)} />
          )}
        </div>
      </div>
    </div>
  );
}
