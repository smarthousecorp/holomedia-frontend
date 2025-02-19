import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const NiceReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams);

  useEffect(() => {
    console.log("=== NiceReturn 페이지 진입 ===");
    console.log("현재 URL:", window.location.href);
    console.log("Search Params:", Object.fromEntries(searchParams));
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

        console.log("=== API 응답 ===", response.data);

        let finalResponse;
        if (authType === "id") {
          // 본인인증 결과로 받은 휴대폰 번호로 아이디 찾기 API 호출
          console.log("=== 아이디 찾기 API 호출 시작 ===");
          const idResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/member/forgot-id`,
            {
              params: {
                mobileno: response.data.data.mobileno,
              },
            }
          );

          // 응답 구조 재구성
          finalResponse = {
            code: 0,
            message: "success",
            data: {
              foundIds: idResponse.data.data,
              // 필요한 경우 본인인증 정보도 포함
              name: decodeURIComponent(response.data.data.utf8_name),
              mobileno: response.data.data.mobileno,
            },
            timestamp: new Date().toISOString(),
          };
        } else {
          finalResponse = response.data;
        }

        // 부모 창으로 결과 전송
        if (window.opener) {
          await new Promise<void>((resolve) => {
            console.log("부모 창으로 전송할 데이터:", finalResponse);
            window.opener.postMessage(finalResponse, window.opener.origin);
            setTimeout(resolve, 3000);
          });
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
            setTimeout(resolve, 3000);
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
