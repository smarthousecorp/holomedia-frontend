// import {defineConfig} from "vite";
// import react from "@vitejs/plugin-react";
// import tsconfigPaths from "vite-tsconfig-paths";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:4000", // 백엔드 서버 주소
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        "/api": {
          target:
            mode === "production"
              ? "http://ec2-15-165-57-43.ap-northeast-2.compute.amazonaws.com:4000"
              : "http://localhost:4000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    // 프로덕션 빌드 설정
    build: {
      sourcemap: false,
      // 필요한 경우 추가 빌드 설정
    },
  };
});
