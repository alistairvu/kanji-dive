import { type PrismaClient } from "@prisma/client";
import { toHiragana } from "wanakana";

export class SearchController {
  constructor(private db: PrismaClient) {}

  async search(query: string) {
    function toTitleCase(str: string) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    return this.db.note.findMany({
      where: {
        OR: [
          {
            character: {
              contains: query,
            },
          },

          {
            meanings: {
              has: toTitleCase(query),
            },
          },
          {
            readings: {
              has: toHiragana(query),
            },
          },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ["character", "meanings", "readings"],
          search: query,
          sort: "desc",
        },
      },
      select: {
        id: true,
        character: true,
        meanings: true,
        readings: true,
        type: true,
      },
    });
  }
}
