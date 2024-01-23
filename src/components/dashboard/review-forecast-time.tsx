import { differenceInDays, format, isSameDay } from "date-fns";

export default function ReviewForecastTime({ time }: { time: Date }) {
  return (
    <p className="whitespace-nowrap">
      {format(time, "h aaaaa")}m
      {!isSameDay(time, Date.now()) && (
        <sup className="text-slate-600">
          +{differenceInDays(time, Date.now()) + 1}
        </sup>
      )}
    </p>
  );
}
