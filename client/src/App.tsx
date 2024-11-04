import {Routes, Route} from "react-router-dom";
import Main from "./pages/main";
import MainLayout from "./components/layout/MainLayout";
import "./index.css";
import VideoDetail from "./pages/videoDetail";
import PublicLayout from "./components/layout/PublicLayout";
import {ToastContainer} from "react-toastify";
import UploadForm from "./pages/uploadVideo";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Main />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/upload" element={<UploadForm />} />
        </Route>
      </Routes>
      <ToastContainer style={{fontSize: "1.4rem"}} limit={1} />
    </>
  );
}

export default App;
