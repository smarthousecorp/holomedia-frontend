import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("✅ 페이지 이동 감지됨:", pathname);

    const mainContentWrapper = document.getElementById("main-content-wrapper");

    if (mainContentWrapper) {
      setTimeout(() => {
        mainContentWrapper.scrollTop = 0;
        console.log(
          "🚀 MainContentWrapper 스크롤 최상단 이동 실행됨:",
          mainContentWrapper.scrollTop
        );
      }, 50);
    } else {
      // 폴백으로 전체 window 스크롤도 처리
      window.scrollTo(0, 0);
      console.log("🚀 Window 스크롤 최상단 이동 실행됨");
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
