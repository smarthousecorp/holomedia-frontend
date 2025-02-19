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
        const authType = searchParams.get("type") || "signup"; // 기본값은 signup

        console.log("인증 파라미터:", {
          enc_data,
          integrity_value,
          token_version_id,
          authType,
        });

        // 서버에 인증 결과 검증 요청
        const response = await axios.get(
          `https://api.holomedia.co.kr/nice/${authType}`,
          {
            params: {
              enc_data,
              integrity_value,
              token_version_id,
            },
            withCredentials: true,
          }
        );

        // 아이디 찾기인 경우 추가 API 호출
        let finalResponse = response;
        if (authType === "id" && response.data.data.mobileno) {
          const idResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/member/forgot-id`,
            {
              params: {
                mobileno: response.data.data.mobileno,
              },
            }
          );
          finalResponse = {
            ...response,
            data: {
              ...response.data,
              foundIds: idResponse.data.data,
            },
          };
        }

        // 부모 창으로 결과 전송
        if (window.opener) {
          // 응답 데이터에서 이름 디코딩
          const responseData = {
            ...finalResponse.data,
            data: {
              ...finalResponse.data.data,
              name: decodeURIComponent(finalResponse.data.data.utf8_name),
            },
          };

          console.log("부모 창으로 전송할 데이터:", responseData);

          await new Promise<void>((resolve) => {
            window.opener.postMessage(responseData, window.opener.origin);
            setTimeout(resolve, 500);
          });

          console.log("메시지 전송 완료");
        }
      } catch (error: any) {
        console.log(error);

        if (window.opener) {
          const errorData = {
            code: -1,
            message: "인증 처리 중 오류가 발생했습니다.",
            data: null,
            timestamp: new Date().toISOString(),
          };

          console.log("에러 메시지 전송:", errorData);

          await new Promise<void>((resolve) => {
            window.opener.postMessage(
              errorData,
              `${import.meta.env.VITE_CLIENT_DOMAIN}`
            );
            setTimeout(resolve, 500);
          });
        }
      } finally {
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
