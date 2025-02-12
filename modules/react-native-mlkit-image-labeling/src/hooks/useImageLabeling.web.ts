import { UnavailabilityError } from "expo-modules-core";

import { RNMLKIT_MODULE_NAME, WEB_ERROR } from "../constants";

const useImageLabeling = () => ({
  modelSpec: "ImageLabeling",
  loaded: () => false,
  isLoaded: false,
  classifyImage: () => {
    throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
  },
  updateOptionsAndReload: () => {
    throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
  },
});

export { useImageLabeling };
