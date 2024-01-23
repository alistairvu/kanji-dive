import { NoteType } from "@prisma/client";

export function getColour(type: NoteType) {
  return {
    "bg-yellow-200 text-amber-950 shadow-yellow-400": type === NoteType.RADICAL,
    "bg-blue-500 text-sky-50 shadow-blue-400": type === NoteType.KANJI,
    "bg-red-500 text-red-50 shadow-red-400": type === NoteType.VOCAB,
  };
}
