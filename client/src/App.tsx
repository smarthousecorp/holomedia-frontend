import { Routes, Route, useLocation } from "react-router-dom";
import Main from "./pages/main";
import MainLayout from "./components/layout/MainLayout";
import "./index.css";
import PublicLayout from "./components/layout/PublicLayout";
import { ToastContainer } from "react-toastify";
// 업로드 어드민페이지로 이동하여 라우터 제거
// import UploadForm from "./pages/uploadVideo";
import "./i18n"; // i18n 설정 import
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import User from "./pages/User";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import VideoDetail from "./pages/videoDetail";
import Settings from "./pages/setting";
import { useEffect } from "react";
// import { preventDevTools } from "./utils/preventDevTools";
import DevToolsAlert from "./pages/devToolsAlert";
import NotificationPage from "./pages/Alarm";
import { logger } from "./utils/logger";
import ProfileSetting from "./pages/ProfileSetting";
import PasswordChange from "./pages/PasswordChange";
import PaymentReturn from "./pages/PaymentReturn";
import NiceReturnPage from "./pages/NiceReturn";
import Creators from "./pages/Creators";
// import Videos from "./pages/Videos";
import PreparePage from "./pages/Prepare";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentManage from "./pages/PaymentManage";
import FindAccount from "./pages/FindAccount";
// interface ErrorMessageProps {
//   message?: string;
// }

// const ErrorMessage: React.FC<ErrorMessageProps> = ({
//   message = "Error detecting country",
// }) => <div>{message}</div>;

function App() {
  const location = useLocation();
  console.log(location.pathname);

  useEffect(() => {
    logger.log("Application started");
  }, []);

  // useEffect(() => {
  //   if (
  //     import.meta.env.VITE_NODE_ENV === "production" &&
  //     !["/dev-tools-alert", "/", "/signup"].includes(location.pathname)
  //   ) {
  //     preventDevTools();
  //   }
  // }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-account" element={<FindAccount />} />
          <Route path="/nice/signup" element={<NiceReturnPage />} />
          <Route path="/nice/id" element={<NiceReturnPage />} />
          <Route path="/nice/password" element={<NiceReturnPage />} />
          <Route path="/api/payment/success" element={<PaymentReturn />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
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
          <Route path="/alarm" element={<NotificationPage />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/videos" element={<PreparePage pageName="vod" />} />
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
          <Route path="/settings/payment-manage" element={<PaymentManage />} />
        </Route>
      </Routes>
      <ToastContainer style={{ fontSize: "1.4rem" }} limit={1} />
    </>
  );
}

export default App;
