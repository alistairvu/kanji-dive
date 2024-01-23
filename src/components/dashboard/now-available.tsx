"use client";

import clsx from "clsx";
import Link, { type LinkProps } from "next/link";
import React from "react";
import { api } from "@/trpc/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { RefreshButton } from "./refresh-button";
import { type Session } from "next-auth";
import { NowAvailableFallback } from "./now-available-fallback";

function LinkWrapper({
  condition,
  children,
  ...props
}: LinkProps & { condition: boolean; children: React.ReactNode }) {
  if (condition) {
    return <Link {...props}>{children}</Link>;
  }

  return <div>{children}</div>;
}

type NowAvailableProps = {
  session: Session;
  initialLessons: number;
  initialReviews: number;
  initialNextReview: {
    nextReviewAt: Date;
  } | null;
  initialLearnedKanji: number;
};

export function NowAvailable({
  session,
  initialLessons,
  initialReviews,
  initialNextReview,
  initialLearnedKanji,
}: NowAvailableProps) {
  const lessonQuery = api.lesson.countLessons.useQuery(undefined, {
    initialData: initialLessons,
    refetchInterval: 60000,
  });

  const reviewQuery = api.review.countReviews.useQuery(undefined, {
    initialData: initialReviews,
    refetchInterval: 60000,
  });

  const nextReviewTimeQuery = api.review.getNextReviewTime.useQuery(undefined, {
    initialData: initialNextReview,
    refetchInterval: 60000,
  });

  if (
    lessonQuery.isLoading ||
    reviewQuery.isLoading ||
    nextReviewTimeQuery.isLoading
  ) {
    return <NowAvailableFallback />;
  }

  const lessonCount = lessonQuery.data;
  const reviewCount = reviewQuery.data;
  const nextReviewTime = nextReviewTimeQuery.data;

  if (
    lessonCount === undefined ||
    reviewCount === undefined ||
    nextReviewTime === undefined
  ) {
    return <NowAvailableFallback />;
  }

  return (
    <div className="rounded-md border border-slate-100 p-4 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name ?? undefined}
            />
            <AvatarFallback>{session.user.name!.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-2">
            <h4 className="font-semibold">{session.user.name}</h4>

            <h5 className="text-sm">{initialLearnedKanji} kanji learned</h5>
          </div>
        </div>

        <RefreshButton />
      </div>

      <div className="font-regular my-4 text-3xl">
        {nextReviewTime === null ? (
          <h4>You have no reviews in the queue yet.</h4>
        ) : reviewCount > 0 ? (
          <h4>
            You have{" "}
            <span className="font-semibold">
              {reviewCount} {reviewCount !== 1 ? "reviews" : "review"}{" "}
            </span>
            left.
          </h4>
        ) : (
          <h4>
            Your next review is{" "}
            <span className="font-semibold">
              {formatDistanceToNowStrict(nextReviewTime.nextReviewAt, {
                addSuffix: true,
                roundingMethod: "round",
              })}
            </span>
            .
          </h4>
        )}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <LinkWrapper condition={lessonCount > 0} href="/lesson">
          <div
            className={clsx(
              "flex items-center justify-between rounded-lg px-2 py-4",
              {
                "cursor-pointer bg-blue-200 hover:bg-blue-300": lessonCount > 0,
                "cursor-not-allowed bg-slate-300": lessonCount === 0,
              },
            )}
          >
            <h4
              className={clsx("text-large font-semibold", {
                "text-blue-900": lessonCount > 0,
                "text-slate-900": lessonCount === 0,
              })}
            >
              Lessons
            </h4>

            <span
              className={clsx(
                "text-large rounded-lg  p-1 px-4 font-semibold text-blue-50",
                {
                  "bg-blue-900": lessonCount > 0,
                  "bg-slate-900": lessonCount === 0,
                },
              )}
            >
              {lessonCount}
            </span>
          </div>
        </LinkWrapper>

        <LinkWrapper condition={reviewCount > 0} href="/review">
          <div
            className={clsx(
              "flex items-center justify-between rounded-lg px-2 py-4",
              {
                "cursor-pointer bg-blue-800 hover:bg-blue-700": reviewCount > 0,
                "cursor-not-allowed bg-slate-300": reviewCount === 0,
              },
            )}
          >
            <h4
              className={clsx("text-large font-semibold", {
                "text-blue-50": reviewCount > 0,
                "text-slate-900": reviewCount === 0,
              })}
            >
              Reviews
            </h4>

            <span
              className={clsx(
                "text-large rounded-lg  p-1 px-4 font-semibold ",
                {
                  "bg-blue-50 text-blue-950": reviewCount > 0,
                  "bg-slate-900 text-slate-100": reviewCount === 0,
                },
              )}
            >
              {reviewCount}
            </span>
          </div>
        </LinkWrapper>
      </div>
    </div>
  );
}
