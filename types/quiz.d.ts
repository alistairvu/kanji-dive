import { type Prisma } from "@prisma/client";

type CardWithNote = Prisma.CardGetPayload<{
  include: { note: true };
}>;

type CardWithStatus = CardWithNote & {
  isReadingIncorrect: boolean;
  isMeaningIncorrect: boolean;
  localWrongStreak: number;
  localStage: number;
};
