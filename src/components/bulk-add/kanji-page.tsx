"use client";

import { useState } from "react";
import { type Note } from "@prisma/client";
import { ItemsConfirmation } from "./items-confirmation";
import { KanjiForm } from "./kanji-form";

export function KanjiPage() {
  const [items, setItems] = useState<Note[] | undefined>(undefined);

  if (items === undefined) {
    return <KanjiForm setItems={setItems} />;
  }

  return <ItemsConfirmation items={items} />;
}
