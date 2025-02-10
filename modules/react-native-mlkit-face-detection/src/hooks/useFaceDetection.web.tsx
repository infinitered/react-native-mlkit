import { WEB_ERROR } from "../constants";

const useFaceDetection = () => ({
  detectFaces: () => {
    throw new Error(WEB_ERROR);
  },
  error: null,
  initialize: () => {
    throw new Error(WEB_ERROR);
  },
  status: "ready",
});

export default useFaceDetection;
