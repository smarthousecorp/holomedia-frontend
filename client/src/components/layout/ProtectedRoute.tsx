import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const isAdmin = useSelector((state: RootState) => state.user.is_admin);
  const isAdmin = true;

  // 성인인증 체크
  if (!isAdmin) {
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
