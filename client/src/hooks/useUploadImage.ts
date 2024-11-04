import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {fstorage} from "../firebase";
import {v4 as uuidv4} from "uuid";

export default function useUploadImage() {
  const storageRef = ref(fstorage, `HOLOMEDIA/${uuidv4()}`);
  // firebase storage에 files이란 폴더가 만들어지고 그 안에 생성된 uuid 이름으로 이미지파일이 저장되게끔 한다.

  const uploadImage = async (file: File) => {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  };

  return uploadImage;
}
