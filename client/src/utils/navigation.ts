// utils/navigation.ts
import { NavigateFunction } from "react-router-dom";

export const navigateOrScrollTop = (
  navigate: NavigateFunction,
  currentPath: string,
  targetPath: string
): boolean => {
  if (currentPath === targetPath) {
    // 이미 대상 경로에 있으면 스크롤만 조정
    const mainContentWrapper = document.getElementById("main-content-wrapper");
    if (mainContentWrapper) {
      mainContentWrapper.scrollTo({ top: 0, behavior: "smooth" });
    }
    return true; // 같은 경로에서 스크롤 이동했음을 알림
  } else {
    // 다른 경로면 이동
    navigate(targetPath);
    return false; // 경로 이동이 발생했음을 알림
  }
};
