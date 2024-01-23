"use client";

import { ClipboardCopy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function CopyList({ list }: { list: string[] }) {
  const handleClick = async () => {
    await navigator.clipboard.writeText(list.join("\n"));
    toast("Copied to clipboard!");
  };

  return (
    <Button onClick={handleClick} size="default" variant="outline">
      <ClipboardCopy /> Copy List
    </Button>
  );
}
