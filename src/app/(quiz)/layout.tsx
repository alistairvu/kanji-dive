import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (session === null) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="relative mb-4 mt-2">
      <div className="container py-4">
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
