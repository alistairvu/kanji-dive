type Duration = {
  years?: number | undefined;
  months?: number | undefined;
  weeks?: number | undefined;
  days?: number | undefined;
  hours?: number | undefined;
  minutes?: number | undefined;
  seconds?: number | undefined;
};

export const INTERVALS: Record<number, Duration> = {
  1: {
    hours: 4,
  },
  2: {
    hours: 12,
  },
  3: {
    hours: 36,
  },
  4: {
    days: 4,
  },
  5: {
    days: 12,
  },
  6: {
    months: 1,
  },
  7: {
    months: 4,
  },
  8: {
    years: 1000,
  },
};

export const FUZZ: Record<number, number> = {
  4: 3,
  5: 3,
  6: 4,
  7: 4,
  8: 5,
};
