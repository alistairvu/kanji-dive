import {
  NOVICE_1,
  INTERMEDIATE_1,
  ADVANCED,
  PROFESSIONAL,
  LEGENDARY,
  NOVICE_3,
  INTERMEDIATE_2,
} from "@/constants/steps";

export const calculateName = (stage: number) => {
  if (stage >= NOVICE_1 && stage <= NOVICE_3) {
    return "Novice " + stage;
  }

  if (stage >= INTERMEDIATE_1 && stage <= INTERMEDIATE_2) {
    return "Intermediate " + (stage - INTERMEDIATE_1 + 1);
  }

  if (stage === ADVANCED) {
    return "Advanced";
  }

  if (stage === PROFESSIONAL) {
    return "Professional";
  }

  if (stage === LEGENDARY) {
    return "Legendary";
  }

  return "Undefined";
};
