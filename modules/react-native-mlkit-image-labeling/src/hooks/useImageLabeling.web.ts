import { WEB_ERROR } from "../constants";

const useImageLabeling = () => ({
  modelSpec: "ImageLabeling",
  loaded: () => false,
  isLoaded: false,
  classifyImage: () => {
    throw new Error(WEB_ERROR);
  },
  updateOptionsAndReload: () => {
    throw new Error(WEB_ERROR);
  },
});

export { useImageLabeling };
