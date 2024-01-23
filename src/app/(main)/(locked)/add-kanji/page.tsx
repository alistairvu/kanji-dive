import { KanjiPage } from "@/components/bulk-add/kanji-page";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();

  if (session === null) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="container flex w-full justify-center">
      <div className="w-full lg:w-2/3">
        <h1 className="text-4xl font-semibold">Bulk Add Kanji</h1>

        <KanjiPage />
      </div>
    </main>
  );
}
