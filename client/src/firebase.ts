// 필요한 Firebase SDK 함수들을 가져옵니다.
import {getApp, getApps, initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";

// Firebase 웹 앱의 설정
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_STORAGE_API_KEY,
  authDomain: import.meta.env.FIREBASE_STORAGE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_STORAGE_PROJECT_ID,
  storageBucket: "quill-image-store.appspot.com",
  messagingSenderId: import.meta.env.FIREBASE_STORAGE_MESSAGINGSENDER_ID,
  appId: import.meta.env.FIREBASE_STORAGE_APP_ID,
  measurementId: import.meta.env.FIREBASE_STORAGE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase Storage 인스턴스 생성
export const fstorage = getStorage();

export default app;
