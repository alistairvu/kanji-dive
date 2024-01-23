import { startOfHour } from "date-fns";

export function roundToHour(date: Date) {
  const roundDown = startOfHour(date);
  return roundDown;
}
