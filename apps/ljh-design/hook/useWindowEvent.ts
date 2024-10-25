import { useEvent } from "react-use";

export const useWindowEvent = () => {
  useEvent("beforeunload", (event) => {
    (event || (event = window.event)).returnValue = "你确定要离开";
  });
};
