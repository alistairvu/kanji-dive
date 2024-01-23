import { SearchBox } from "@/components/search/search-box";
import { api } from "@/trpc/server";
import { getColour } from "@/utils/get-colour";
import { NoteType } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = searchParams.query;

  if (query === undefined) {
    return (
      <div className="container flex w-full justify-center">
        <div className="lg:w-[66%]">
          <SearchBox />

          <div className="my-4 text-center">Start your search above.</div>
        </div>
      </div>
    );
  }

  if (query.length === 0) {
    return (
      <div className="container flex w-full justify-center">
        <div className="lg:w-[66%]">
          <SearchBox />

          <div className="my-4 text-center">Start your search above.</div>
        </div>
      </div>
    );
  }

  const results = await api.search.search.query(
    Array.isArray(query) ? query[0]! : query,
  );

  return (
    <div className="container flex w-full justify-center">
      <div className="lg:w-[66%]">
        <SearchBox defaultValue={query as string} />

        <div className="my-4 text-center">
          {results.length === 0
            ? "No results."
            : results.map((note) => (
                <Link key={note.id} href={`/note/${note.id}`} className="mb-1">
                  <div
                    className={clsx(
                      "mb-2 flex h-16 w-full items-center justify-between rounded-sm px-4 text-4xl shadow-sm ",
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
              ))}
        </div>
      </div>
    </div>
  );
}
