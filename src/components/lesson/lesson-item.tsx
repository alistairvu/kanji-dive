"use client";

import { NoteType, type Note } from "@prisma/client";
import { noto } from "../fonts";
import clsx from "clsx";
import { getColour } from "@/utils/get-colour";

type LessonItemProps = {
  note: Note;
};

export function LessonItem({ note }: LessonItemProps) {
  return (
    <>
      <div
        className={clsx(
          "static flex h-[16rem] flex-col rounded-sm p-8 shadow-md md:h-[24rem]",
          getColour(note.type),
        )}
      >
        <div className="itmes-center flex flex-grow flex-col items-center justify-center">
          <h4
            className={`${
              note.type != NoteType.VOCAB
                ? "text-7xl md:text-9xl"
                : "text-5xl md:text-7xl"
            } drop-shadow-sm ${noto.className}`}
          >
            {note.character}
          </h4>
        </div>

        <p className="text-center text-2xl">{note.meanings[0]}</p>
      </div>

      <div className="mt-2 space-y-4 rounded-sm border p-4 shadow-sm">
        <div>
          <h4 className="text-2xl font-semibold">Meanings</h4>
          <h3 className="text-xl font-semibold">{note.meanings.join(", ")}</h3>
        </div>

        <hr />
        <div>
          <h4 className="text-2xl font-semibold">Readings</h4>

          {note.type === NoteType.KANJI ? (
            <>
              <h3 className={clsx("font-noto text-2xl font-semibold")}>
                On: {note.readingsOn.join(", ")}
              </h3>

              <h3 className={clsx("font-noto text-2xl font-semibold")}>
                Kun: {note.readingsKun.join(", ")}
              </h3>
            </>
          ) : (
            <h3 className={clsx("font-noto text-2xl font-semibold")}>
              {note.readings.join(", ")}
            </h3>
          )}
        </div>
      </div>
    </>
  );
}
