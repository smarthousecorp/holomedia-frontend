import {Routes, Route} from "react-router-dom";
import Main from "./pages/main";
import MainLayout from "./components/layout/MainLayout";
import "./index.css";
import VideoDetail from "./pages/videoDetail";
import PublicLayout from "./components/layout/PublicLayout";
import {ToastContainer} from "react-toastify";
import UploadForm from "./pages/uploadVideo";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Settings from "./pages/setting";
import "./i18n"; // i18n 설정 import
import {useCountryDetection} from "./hooks/useCountryDetection";
import Loading from "./components/commons/Loading";
import ErrorPage from "./pages/Error";
import Login from "./pages/Login";

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
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/error" element={<ErrorPage error="500" />} />
        </Route>
        <Route path="/*" element={<ErrorPage error="404" />} />
      </Routes>
      <ToastContainer style={{fontSize: "1.4rem"}} limit={1} />
    </>
  );
}

export default App;
