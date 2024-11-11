import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {fstorage} from "../firebase";
import {v4 as uuidv4} from "uuid";

export default function useUploadVideo() {
  const uploadVideo = async (file: File) => {
    try {
      // 비디오 파일용 전용 폴더 사용
      const videoRef = ref(fstorage, `HOLOMEDIA/videos/${uuidv4()}`);

      // 업로드 진행 상태를 확인할 수 있는 snapshot 반환
      const snapshot = await uploadBytes(videoRef, file);

      // 업로드된 파일의 다운로드 URL 획득
      const downloadUrl = await getDownloadURL(snapshot.ref);

      return downloadUrl;
    } catch (error) {
      console.error("Video upload error:", error);
      throw new Error("비디오 업로드 중 오류가 발생했습니다.");
    }
  };

  return uploadVideo;
}
