import React from "react";
import { Skeleton } from "../ui/skeleton";

export async function NowAvailableFallback() {
  return (
    <div className="rounded-md border border-slate-100 p-4 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="font-regular my-4 text-3xl">
        Calculating your reviews...
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <Skeleton className="h-16 justify-between rounded-lg px-2 py-4" />
        </div>

        <div>
          <Skeleton className="h-16 justify-between rounded-lg px-2 py-4" />
        </div>
      </div>
    </div>
  );
}
