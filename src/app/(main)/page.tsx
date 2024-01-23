import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="container my-4">
      <h1 className="text-6xl font-semibold">Learn. Wait. Review</h1>

      <p className="mt-2">
        Dive into the world of Kanji with KanjiDive, where you can easily learn
        and review thousands of Kanji characters and vocabulary words containing
        Kanji. Utilizing the spaced repetition method, KanjiDive helps you
        retain information longer without overwhelming you. Whether you're a
        beginner or a Kanji master, you'll find learning Kanji more engaging and
        effective than ever. Ready to plunge into the ocean of Kanji characters?
      </p>
    </main>
  );
}
