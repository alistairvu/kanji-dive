"use client";

import {
  INTERMEDIATE_1,
  NOVICE_1,
  ADVANCED,
  PROFESSIONAL,
  LEGENDARY,
} from "@/constants/steps";
import { api } from "@/trpc/react";
import { type Prisma } from "@prisma/client";

type NoteStagesDisplayProps = {
  initialCount: (Prisma.PickEnumerable<
    Prisma.CardGroupByOutputType,
    "stage"[]
  > & {
    _count: {
      stage: number;
    };
  })[];
};

export function NoteStagesDisplay({ initialCount }: NoteStagesDisplayProps) {
  const countObjectsQuery = api.note.countByStage.useQuery(undefined, {
    initialData: initialCount,
  });

  const countObjects = countObjectsQuery.data;

  const apperenticeCount = countObjects
    .filter((item) => item.stage < INTERMEDIATE_1 && item.stage >= NOVICE_1)
    .reduce((acc, curr) => acc + curr._count.stage, 0);

  const guruCount = countObjects
    .filter((item) => item.stage < ADVANCED && item.stage >= INTERMEDIATE_1)
    .reduce((acc, curr) => acc + curr._count.stage, 0);

  const masterCount = countObjects
    .filter((item) => item.stage === ADVANCED)
    .reduce((acc, curr) => acc + curr._count.stage, 0);

  const enlightenedCount = countObjects
    .filter((item) => item.stage === PROFESSIONAL)
    .reduce((acc, curr) => acc + curr._count.stage, 0);

  const burnedCount = countObjects
    .filter((item) => item.stage === LEGENDARY)
    .reduce((acc, curr) => acc + curr._count.stage, 0);

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-1 rounded-sm bg-pink-600 p-4 text-center text-blue-50">
          <h4 className="font-normal">Novice</h4>
          <h6 className="text-4xl font-semibold">{apperenticeCount}</h6>
        </div>

        <div className="col-span-1 rounded-sm bg-purple-600 p-4 text-center text-blue-50">
          <h4 className="font-normal">Intermediate</h4>
          <h6 className="text-4xl font-semibold">{guruCount}</h6>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-1 rounded-sm bg-blue-600 p-4 text-center text-blue-50">
          <h4 className="font-normal">Advanced</h4>
          <h6 className="text-4xl font-semibold">{masterCount}</h6>
        </div>

        <div className="col-span-1 rounded-sm bg-sky-600 p-4 text-center text-blue-50">
          <h4 className="font-normal">Professional</h4>
          <h6 className="text-4xl font-semibold">{enlightenedCount}</h6>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 rounded-sm bg-blue-950 p-4 text-center text-blue-50">
          <h4 className="font-normal">Legendary</h4>
          <h6 className="text-4xl font-semibold">{burnedCount}</h6>
        </div>
      </div>
    </div>
  );
}
