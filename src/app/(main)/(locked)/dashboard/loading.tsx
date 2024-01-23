import { NowAvailableFallback } from "@/components/dashboard/now-available-fallback";

export default async function Loading() {
  return (
    <main className="container py-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <NowAvailableFallback />
        </div>
      </div>
    </main>
  );
}
