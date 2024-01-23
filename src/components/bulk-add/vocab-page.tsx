"use client";

import { useState } from "react";
import { VocabForm } from "./vocab-form";
import { type Note } from "@prisma/client";
import { ItemsConfirmation } from "./items-confirmation";

export function VocabPage() {
  const [items, setItems] = useState<Note[] | undefined>(undefined);

  if (items === undefined) {
    return <VocabForm setItems={setItems} />;
  }

  return <ItemsConfirmation items={items} />;
}
