import { useEffect, useMemo, useState } from "react";
import {
  determineDisplaySize,
  determineDisplayRatio,
  determineWindowDimensions,
} from "./determineDisplaySize";

export const useResponsive = () => {
  const [currentDisplaySize, setCurrentDisplaySize] = useState(
    determineDisplaySize(window.innerWidth)
  );

  useEffect(() => {
    const handler = () =>
      setCurrentDisplaySize(determineDisplaySize(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return useMemo(() => currentDisplaySize, [currentDisplaySize]);
};

export const useDirection = () => {
  const [currentDisplayRatio, setCurrentDisplayRatio] = useState(
    determineDisplayRatio(window.innerWidth, window.innerHeight)
  );

  useEffect(() => {
    const handler = () =>
      setCurrentDisplayRatio(
        determineDisplayRatio(window.innerWidth, window.innerHeight)
      );
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return useMemo(() => currentDisplayRatio, [currentDisplayRatio]);
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    determineWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(determineWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
};
