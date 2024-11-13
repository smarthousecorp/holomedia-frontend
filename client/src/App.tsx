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
import ErrorPage from "./pages/Error";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Main />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/upload" element={<UploadForm />} />
          <Route
            path="/video/:id"
            element={
              <ProtectedRoute>
                <VideoDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/error" element={<ErrorPage />} />
        </Route>
      </Routes>
      <ToastContainer style={{fontSize: "1.4rem"}} limit={1} />
    </>
  );
}

export default App;
