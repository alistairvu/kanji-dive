import {
  NOVICE_1,
  LEGENDARY,
  NOVICE_2,
  NOVICE_3,
  INTERMEDIATE_1,
  INTERMEDIATE_2,
  ADVANCED,
  PROFESSIONAL,
} from "@/constants/steps";
import { calculateName } from "@/utils/calculate-stage";
import { describe, test, expect } from "vitest";

describe(calculateName, () => {
  test("correctly return undefined if out of bounds", () => {
    expect(calculateName(LEGENDARY + 1)).toBe("Undefined");
    expect(calculateName(0)).toBe("Undefined");
  });

  test("correctly return values for Novice stages", () => {
    expect(calculateName(NOVICE_1)).toBe("Novice 1");
    expect(calculateName(NOVICE_2)).toBe("Novice 2");
    expect(calculateName(NOVICE_3)).toBe("Novice 3");
  });

  test("correctly return values for Intermediate stages", () => {
    expect(calculateName(INTERMEDIATE_1)).toBe("Intermediate 1");
    expect(calculateName(INTERMEDIATE_2)).toBe("Intermediate 2");
  });

  test("correctly return values for last three stages", () => {
    expect(calculateName(ADVANCED)).toBe("Advanced");
    expect(calculateName(PROFESSIONAL)).toBe("Professional");
    expect(calculateName(LEGENDARY)).toBe("Legendary");
  });
});
