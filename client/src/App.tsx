import { Routes, Route, useLocation } from "react-router-dom";
import Main from "./pages/main";
import MainLayout from "./components/layout/MainLayout";
import "./index.css";
import PublicLayout from "./components/layout/PublicLayout";
import { ToastContainer } from "react-toastify";
// 업로드 어드민페이지로 이동하여 라우터 제거
// import UploadForm from "./pages/uploadVideo";
import "./i18n"; // i18n 설정 import
import { useCountryDetection } from "./hooks/useCountryDetection";
import Loading from "./components/commons/Loading";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import User from "./pages/User";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import VideoDetail from "./pages/videoDetail";
import Settings from "./pages/setting";
import { useEffect } from "react";
import { preventDevTools } from "./utils/preventDevTools";
import DevToolsAlert from "./pages/devToolsAlert";
import NotificationPage from "./pages/Alarm";
import { logger } from "./utils/logger";
import ProfileSetting from "./pages/ProfileSetting";
import PasswordChange from "./pages/PasswordChange";
import PaymentReturn from "./pages/PaymentReturn";
// interface ErrorMessageProps {
//   message?: string;
// }

// const ErrorMessage: React.FC<ErrorMessageProps> = ({
//   message = "Error detecting country",
// }) => <div>{message}</div>;

function App() {
  const { countryInfo, loading } = useCountryDetection();
  const location = useLocation();

  useEffect(() => {
    logger.log("Application started");
  }, []);

  useEffect(() => {
    if (
      import.meta.env.VITE_NODE_ENV === "production" &&
      !["/dev-tools-alert", "/", "/signup"].includes(location.pathname)
    ) {
      preventDevTools();
    }
  }, [location.pathname]);

  if (countryInfo && loading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/payment" element={<PaymentReturn />} />
          <Route path="/*" element={<ErrorPage error="404" />} />
          <Route path="/error" element={<ErrorPage error="500" />} />
          <Route path="/dev-tools-alert" element={<DevToolsAlert />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/main" element={<Main />} />
          <Route
            path="/video/:id"
            element={
              <ProtectedRoute>
                <VideoDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/user/:id" element={<User />} />
          {/* <Route
            path="/upload"
            element={
              // <UploaderRoute>
              <UploadForm />
              // </UploaderRoute>
            }
          /> */}
          <Route path="/alarm" element={<NotificationPage />} />
          {/* <Route
            path="/membership"
            element={<PreparePage pageName="멤버십" />}
          /> */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/profile" element={<ProfileSetting />} />
          <Route
            path="/settings/password-change"
            element={<PasswordChange />}
          />
        </Route>
      </Routes>
      <ToastContainer style={{ fontSize: "1.4rem" }} limit={1} />
    </>
  );
}

export default App;
