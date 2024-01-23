import { type Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { api } from "@/trpc/server";
import clsx from "clsx";
import { Badge } from "../ui/badge";

type HeaderProfileProps = {
  session: Session;
};

export async function HeaderProfile({ session }: HeaderProfileProps) {
  const lessonCount = await api.lesson.countLessons.query();
  const reviewCount = await api.review.countReviews.query();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={session.user.image ?? undefined}
            alt={session.user.name ?? undefined}
          />
          <AvatarFallback>{session.user.name!.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href="/dashboard">
          <DropdownMenuItem className="cursor-pointer">
            Dashboard
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <Link href={lessonCount > 0 ? "/lesson" : "/"}>
          <DropdownMenuItem
            className={clsx(
              lessonCount > 0 && "cursor-pointer",
              "flex items-center justify-between",
            )}
          >
            <span>Lessons</span>
            <Badge
              className={clsx(
                lessonCount > 0
                  ? "bg-blue-200 text-blue-900 hover:bg-blue-300"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300",
              )}
            >
              {lessonCount}
            </Badge>
          </DropdownMenuItem>
        </Link>

        <Link href={reviewCount > 0 ? "/review" : "/"}>
          <DropdownMenuItem
            className={clsx(
              reviewCount > 0 && "cursor-pointer",
              "flex items-center justify-between",
            )}
          >
            <span>Reviews</span>
            <Badge
              className={clsx(
                reviewCount > 0
                  ? "bg-sky-200 text-sky-900 hover:bg-sky-300"
                  : "bg-slate-200 text-slate-900 hover:bg-slate-300",
              )}
            >
              {reviewCount}
            </Badge>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <Link href="/search">
          <DropdownMenuItem className="cursor-pointer">Search</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />

        <Link href="/api/auth/signout">
          <DropdownMenuItem className="cursor-pointer">
            Sign Out
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
