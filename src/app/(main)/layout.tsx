import { Header } from "@/components/layout/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="relative mb-4 mt-16">{children}</main>
    </>
  );
}
