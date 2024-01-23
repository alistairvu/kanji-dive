import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="container my-4">
      <h1 className="text-6xl font-semibold">Learn. Wait. Review.</h1>

      <p className="my-4 text-2xl">
        Dive into the world of Kanji with KanjiDive, where you can easily learn
        and review thousands of Kanji characters and vocabulary words containing
        Kanji.
      </p>
      <p className="my-4 text-2xl">
        Utilizing a smart spaced repetition algorithm, KanjiDive helps you
        retain information longer without overwhelming you.
      </p>
      <p className="my-4 text-2xl">
        Ready to plunge into the ocean of Kanji characters?
      </p>

      <Link
        href="/api/auth/signin"
        className={cn(buttonVariants({ variant: "default" }), "mt-2")}
      >
        Sign in with Discord
      </Link>
    </main>
  );
}
