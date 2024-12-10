import {Routes, Route} from "react-router-dom";
import Main from "./pages/main";
import MainLayout from "./components/layout/MainLayout";
import "./index.css";
// import ProtectedRoute from "./components/layout/ProtectedRoute";
// import VideoDetail from "./pages/videoDetail";
import PublicLayout from "./components/layout/PublicLayout";
import {ToastContainer} from "react-toastify";
import UploadForm from "./pages/uploadVideo";
import "./i18n"; // i18n 설정 import
import {useCountryDetection} from "./hooks/useCountryDetection";
import Loading from "./components/commons/Loading";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import PreparePage from "./pages/Prepare";
import User from "./pages/User";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import VideoDetail from "./pages/videoDetail";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Error detecting country",
}) => <div>{message}</div>;

function App() {
  const {countryInfo, error, loading} = useCountryDetection();

  if (countryInfo && loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<ErrorPage error="404" />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/main" element={<Main />} />
          {/* <Route
            path="/video/:id"
            element={<PreparePage pageName="영상 조회" />}
          /> */}
          <Route
            path="/video/:id"
            element={
              <ProtectedRoute>
                <VideoDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/user/:id" element={<User />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/alarm" element={<PreparePage pageName="알림" />} />
          {/* <Route
            path="/membership"
            element={<PreparePage pageName="멤버십" />}
          /> */}
          <Route path="/settings" element={<PreparePage pageName="설정" />} />
          <Route path="/error" element={<ErrorPage error="500" />} />
        </Route>
      </Routes>
      <ToastContainer style={{fontSize: "1.4rem"}} limit={1} />
    </>
  );
}

export default App;
