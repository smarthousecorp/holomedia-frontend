import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {getCookie} from "../../utils/cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const isAdultVerified = useSelector(
    (state: RootState) => state.user.is_adult_verified
  );
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // 로그인 체크
  if (!isLoggedIn) {
    // 로컬스토리지, 쿠키의 토큰도 확인
    const token =
      localStorage.getItem("accessToken") || getCookie("accessToken");
    if (!token) {
      return <Navigate to="/" replace />;
    }
  }

  // 성인인증 체크
  if (!isAdultVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
