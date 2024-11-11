import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {fstorage} from "../firebase";
import {v4 as uuidv4} from "uuid";

export default function useUploadImage() {
  const uploadImage = async (file: File) => {
    // 각 업로드마다 새로운 uuid 생성
    const imageRef = ref(fstorage, `HOLOMEDIA/${uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  };

  return uploadImage;
}
