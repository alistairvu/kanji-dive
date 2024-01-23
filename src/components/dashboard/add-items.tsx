"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function AddItems() {
  return (
    <div className="rounded-md border border-slate-100 p-4 shadow-md">
      <h4 className="text-2xl font-semibold">Want more lessons?</h4>
      <p className="my-2">
        Click on the links below to add more kanji and vocab to your lessons.
      </p>

      <div>
        <Link
          className={cn(buttonVariants({ variant: "default" }), "mt-2")}
          href="/add-kanji"
        >
          <Plus className="mr-2" /> Add Kanji
        </Link>
      </div>

      <div>
        <Link
          className={cn(buttonVariants({ variant: "default" }), "mt-2")}
          href="/add-vocab"
        >
          <Plus className="mr-2" /> Add Kanji and Vocab
        </Link>
      </div>
    </div>
  );
}
