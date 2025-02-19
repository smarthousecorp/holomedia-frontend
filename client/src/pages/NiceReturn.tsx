import React, { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

type AuthType = "signup" | "id" | "password";

const NiceReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

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

        // URL 경로에서 인증 타입 추출
        const pathSegments = location.pathname.split("/");
        const authType = pathSegments[pathSegments.length - 1] as AuthType;

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

          console.log("아이디 찾기 API 응답:", idResponse.data);

          // 응답 구조 재구성
          finalResponse = {
            code: 0,
            message: "아이디 찾기가 완료되었습니다.",
            data: {
              ...response.data.data, // 기존 본인인증 데이터 유지
              foundIds: idResponse.data.data, // ID 찾기 결과 추가
            },
            timestamp: new Date().toISOString(),
          };
        } else {
          console.log("else문 실행 됨");
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
      <p>처리가 끝나면 창은 자동으로 닫힙니다.</p>
    </div>
  );
};

export default NiceReturnPage;
