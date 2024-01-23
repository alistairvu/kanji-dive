/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NoteType, PrismaClient } from "@prisma/client";
import data from "./data.json";

const log = (msg: string) => {
  console.log(`[prisma/seed.ts] ${msg}`);
};

log("Creating Prisma Client...");

const db = new PrismaClient();
await db.$connect();
log("DB Connected");

await db.card.deleteMany({});

log("Cleared all cards");

await db.note.deleteMany({});

log("Cleared all notes");

const kanjis = data.filter((x) => x.type === "KANJI");
const kanjiData = kanjis.map((x) => ({
  ...x,
  type: NoteType.KANJI,
}));

let addedKanjiCount = 0;

await Promise.all(
  kanjiData.map((x) =>
    db.note
      .create({
        data: x,
      })
      .then((_) => {
        addedKanjiCount++;
        log(`Added ${addedKanjiCount} / ${kanjiData.length} kanji`);
      }),
  ),
);

log("Created kanjis");

const createdKanjis = await db.note.findMany({
  where: {
    type: NoteType.KANJI,
  },
});

const vocab = data.filter((x) => x.type === "VOCAB");
const vocabData = vocab.map((x) => ({
  ...x,
  type: NoteType.VOCAB,
  components: {
    connect: createdKanjis
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      .filter((y) => x.components!.includes(y.character))
      .map((y) => ({ id: y.id })),
  },
}));

let addedVocabCount = 0;

await Promise.all(
  vocabData.map((x) =>
    db.note
      .create({
        data: x,
      })
      .then((_) => {
        addedVocabCount++;
        log(`Added ${addedVocabCount} / ${vocabData.length} vocab`);
      }),
  ),
);

log("Created vocab");

log("Database Seeded");
