import { roundToHour } from "@/utils/round-hour";
import { describe, test, expect } from "vitest";

describe(roundToHour, () => {
  test("correctly round up", () => {
    const testDate = new Date();
    testDate.setHours(10);
    testDate.setMinutes(30);
    testDate.setSeconds(1);

    const roundResult = roundToHour(testDate);

    expect(roundResult).toBeTruthy();
    expect(roundResult!.getHours()).toBe(11);
    expect(roundResult!.getMinutes()).toBe(0);
    expect(roundResult!.getSeconds()).toBe(0);
    expect(roundResult!.getMilliseconds()).toBe(0);
  });

  test("correctly round down", () => {
    const testDate = new Date();
    testDate.setHours(10);
    testDate.setMinutes(29);
    testDate.setSeconds(59);

    const roundResult = roundToHour(testDate);

    expect(roundResult).toBeTruthy();
    expect(roundResult!.getHours()).toBe(10);
    expect(roundResult!.getMinutes()).toBe(0);
    expect(roundResult!.getSeconds()).toBe(0);
    expect(roundResult!.getMilliseconds()).toBe(0);
  });
});
