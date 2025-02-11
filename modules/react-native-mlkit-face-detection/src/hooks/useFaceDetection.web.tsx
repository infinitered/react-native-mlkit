import { UnavailabilityError } from "expo-modules-core";

import { WEB_ERROR, RNMLKIT_MODULE_NAME } from "../constants";

const useFaceDetection = () => ({
  detectFaces: () => {
    throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
  },
  error: null,
  initialize: () => {
    throw new Error(WEB_ERROR);
  },
  status: "ready",
});

export default useFaceDetection;
