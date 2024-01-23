import { api } from "@/trpc/server";
import { NoteStagesDisplay } from "./note-stages-display";

export async function NoteStages() {
  const countObjects = await api.note.countByStage.query();

  return <NoteStagesDisplay initialCount={countObjects} />;
}
