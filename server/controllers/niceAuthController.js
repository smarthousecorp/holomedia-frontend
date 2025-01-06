// controllers/niceAuthController.js
const NiceAuth = require("../module/NiceAuth");

const niceAuthController = {
  async requestAuth(req, res) {
    try {
      const niceAuth = new NiceAuth();
      const token = await niceAuth.getAccessToken();

      if (!token) {
        throw new Error("액세스 토큰을 얻지 못했습니다");
      }

      const certResult = await niceAuth.requestCertification(token, {
        returnUrl: `${process.env.FRONTEND_URL}/nice/callback`,
      });

      // 에러 응답 확인
      if (certResult.dataHeader.GW_RSLT_CD !== "1200") {
        throw new Error(`NICE API 오류: ${certResult.dataHeader.GW_RSLT_MSG}`);
      }

      if (certResult.dataBody.result_cd !== "0000") {
        throw new Error(`NICE API 결과 오류: ${certResult.dataBody.result_cd}`);
      }

      const responseData = {
        success: true,
        token_version_id: certResult.dataBody.token_version_id,
        enc_data: certResult.enc_data,
        integrity_value: certResult.integrity_value,
      };

      console.log("응답될값", responseData);

      res.json(responseData);
    } catch (error) {
      console.error("NICE 인증 요청 오류:", error);
      res.status(error.response?.status || 500).json({
        success: false,
        message: error.message || "인증 요청 처리 중 오류가 발생했습니다.",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  async verifyAuth(req, res) {
    try {
      const niceAuth = new NiceAuth();
      const token = await niceAuth.getAccessToken();

      const { token_version_id, enc_data, integrity_value } = req.body;

      const result = await niceAuth.getCertificationResult(
        token,
        token_version_id,
        enc_data,
        integrity_value
      );

      // 성인 여부 확인
      const birthDate = new Date(result.birthdate);
      const age = calculateAge(birthDate);

      res.json({
        success: true,
        age,
        // 기타 필요한 정보
      });
    } catch (error) {
      console.error("NICE Auth Verification Error:", error);
      res.status(500).json({
        success: false,
        message: "인증 결과 검증 중 오류가 발생했습니다.",
      });
    }
  },
};

// 나이 계산 헬퍼 함수
function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

module.exports = niceAuthController;
