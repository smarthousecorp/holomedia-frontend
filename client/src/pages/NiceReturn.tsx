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

        console.log("인증 파라미터:", {
          enc_data,
          integrity_value,
          token_version_id,
        });

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

          console.log("부모 창으로 전송할 데이터:", responseData);

          // postMessage 전송 후 Promise로 지연
          await new Promise<void>((resolve) => {
            window.opener.postMessage(responseData, window.opener.origin);
            // 메시지가 전송될 시간을 주기 위해 약간의 지연
            setTimeout(resolve, 500);
          });

          console.log("메시지 전송 완료");
        }
      } catch (error: any) {
        console.log(error);

        // 에러 발생 시 부모 창에 에러 메시지 전송
        if (window.opener) {
          const errorData = {
            code: -1,
            message: "인증 처리 중 오류가 발생했습니다.",
            data: null,
            timestamp: new Date().toISOString(),
          };

          console.log("에러 메시지 전송:", errorData);

          // 에러 메시지도 전송 후 지연
          await new Promise<void>((resolve) => {
            window.opener.postMessage(
              errorData,
              `${import.meta.env.VITE_CLIENT_DOMAIN}`
            );
            setTimeout(resolve, 500);
          });
        }
      } finally {
        // 처리 완료 후 창 닫기
        window.close();
      }
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
