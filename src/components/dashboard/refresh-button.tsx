"use client";

import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

export function RefreshButton() {
  return (
    <Link href="/" prefetch={false}>
      <Button size="icon" variant="outline">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </Link>
  );
}
