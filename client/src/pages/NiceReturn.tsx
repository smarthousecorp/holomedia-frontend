import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const NiceReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams);

  useEffect(() => {
    console.log("niceReturn useEffect 실행");

    const processAuthResult = async () => {
      try {
        // URL 파라미터에서 인증 데이터 추출
        const enc_data = searchParams.get("enc_data");
        const integrity_value = searchParams.get("integrity_value");
        const token_version_id = searchParams.get("token_version_id");

        // 서버에 인증 결과 검증 요청
        const response = await axios.get(
          "https://api.holomedia.co.kr/nice/signup",
          {
            params: {
              enc_data,
              integrity_value,
              token_version_id,
            },
            withCredentials: true,
          }
        );

        console.log(response.data.name);

        // 부모 창으로 결과 전송
        if (window.opener) {
          // 응답 데이터에서 이름 디코딩
          const responseData = {
            ...response.data,
            data: {
              ...response.data.data,
              name: decodeURIComponent(response.data.data.utf8_name),
            },
          };

          window.opener.postMessage(responseData, window.opener.origin);
        }
      } catch (error: any) {
        console.log(error);

        // 에러 발생 시 부모 창에 에러 메시지 전송
        if (window.opener) {
          window.opener.postMessage(
            {
              code: -1,
              message: "인증 처리 중 오류가 발생했습니다.",
              data: null,
              timestamp: new Date().toISOString(),
            },
            `${import.meta.env.VITE_CLIENT_DOMAIN}`
          );
        }
      }

      // 처리 완료 후 창 닫기
      window.close();
    };

    processAuthResult();
  }, [searchParams]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>인증 처리 중입니다...</p>
    </div>
  );
};

export default NiceReturnPage;
