"use client";

import { api } from "@/trpc/react";
import { Progress } from "../ui/progress";
import dynamic from "next/dynamic";

type ReviewForecastDisplayProps = {
  initCurrentReviews: number;
  initForecast: {
    nextReviewAt: Date;
    _count: number;
  }[];
};

const ReviewForecastTime = dynamic(() => import("./review-forecast-time"), {
  ssr: false,
});

export function ReviewForecastDisplay({
  initForecast,
  initCurrentReviews,
}: ReviewForecastDisplayProps) {
  const currentReviewsQuery = api.review.countReviews.useQuery(undefined, {
    initialData: initCurrentReviews,
  });
  const forecastQuery = api.review.forecastReviews.useQuery(undefined, {
    initialData: initForecast,
  });

  const maxReviews = forecastQuery.data.reduce(
    (acc, curr) => Math.max(acc, curr._count),
    0,
  );

  let totalReviews = currentReviewsQuery.data;
  const counts = forecastQuery.data.map((item) => {
    totalReviews += item._count;

    return {
      count: item._count,
      time: item.nextReviewAt,
      total: totalReviews,
    };
  });

  if (counts.length === 0) {
    return <p className="text-lg">No new reviews in the next 24 hours.</p>;
  }

  return (
    <div>
      {counts.map(({ count, time, total }) => (
        <div
          key={time.toISOString()}
          className="my-1 grid grid-cols-9 items-center justify-center gap-2"
        >
          <div className="col-span-2">
            <ReviewForecastTime time={time} />
          </div>

          <div className="col-span-5">
            <Progress
              className="ml-2 flex-grow bg-transparent"
              value={5 + (count / maxReviews) * 90}
            />
          </div>

          <p className="col-span-1 text-right">+{count}</p>
          <p className="col-span-1 border-l border-blue-600 pl-2 text-slate-500">
            {total}
          </p>
        </div>
      ))}
    </div>
  );
}
