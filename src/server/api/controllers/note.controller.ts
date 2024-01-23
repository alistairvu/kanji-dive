import { NoteType, type PrismaClient } from "@prisma/client";

export class NoteRouter {
  constructor(private db: PrismaClient) {}

  async find(noteId: number) {
    return this.db.note.findUnique({
      where: {
        id: noteId,
      },
      include: {
        foundIn: true,
        components: true,
      },
    });
  }

  async findCardWithNote(userId: string, noteId: number) {
    return this.db.card.findFirst({
      where: {
        userId,
        noteId,
      },
    });
  }

  async get() {
    return this.db.note.findMany({});
  }

  async countByStage(userId: string) {
    return this.db.card.groupBy({
      by: ["stage"],
      _count: {
        stage: true,
      },
      where: {
        userId,
      },
      orderBy: {
        _count: {
          stage: "asc",
        },
      },
    });
  }

  async findKanjisToCreate(characters: string[], userId: string) {
    return this.db.note.findMany({
      where: {
        character: {
          in: characters,
        },
        type: NoteType.KANJI,
        cards: {
          none: {
            userId,
          },
        },
      },
    });
  }

  async findVocabToCreate(characters: string[], userId: string) {
    return this.db.note.findMany({
      where: {
        OR: [
          {
            character: {
              in: characters,
            },
            type: NoteType.VOCAB,
          },
          {
            foundIn: {
              some: {
                character: { in: characters },
              },
            },
            type: NoteType.KANJI,
          },
        ],
        cards: {
          none: {
            userId,
          },
        },
      },
      orderBy: {
        type: "desc",
      },
    });
  }
}
