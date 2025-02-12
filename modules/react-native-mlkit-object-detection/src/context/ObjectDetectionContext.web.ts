import { UnavailabilityError } from "expo-modules-core";

import { RNMLKIT_MODULE_NAME, WEB_ERROR } from "../constants";

export function useObjectDetectionContext() {
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}
