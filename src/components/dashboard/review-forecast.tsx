import { api } from "@/trpc/server";
import { ReviewForecastDisplay } from "./review-forecast-display";

export async function ReviewForecast() {
  const currentReviews = await api.review.countReviews.query();
  const forecast = await api.review.forecastReviews.query();

  return (
    <div className="mb-4 rounded-sm border border-slate-50 p-4 shadow-md">
      <h2 className="text-2xl font-semibold">Forecast</h2>

      <ReviewForecastDisplay
        initCurrentReviews={currentReviews}
        initForecast={forecast}
      />
    </div>
  );
}
