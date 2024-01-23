import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { HeaderProfile } from "./header-profile";
import { Languages } from "lucide-react";

export async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className="fixed top-0 z-50 w-full bg-primary text-slate-100 shadow-md">
      <div className="container flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <Languages className="h-6 w-6 stroke-2" />
            <h2 className="hidden font-agba text-xl md:block">kanji dive</h2>
          </Link>
        </div>

        <div>
          {session ? (
            <HeaderProfile session={session} />
          ) : (
            <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
              <Button variant="ghost">
                {session ? "Sign Out" : "Sign In"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
