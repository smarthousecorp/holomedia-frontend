// controllers/niceAuthController.js
const NiceAuth = require("../module/NiceAuth");

const niceAuthController = {
  async requestAuth(req, res) {
    try {
      const niceAuth = new NiceAuth();
      const token = await niceAuth.getAccessToken();
      console.log(token);

      const certResult = await niceAuth.requestCertification(token, {
        returnUrl: `${process.env.FRONTEND_URL}/nice/callback`,
        // 기타 필요한 설정
      });
      console.log("토큰을 성공적으로 반환함", certResult);

      res.json({
        success: true,
        data: {
          enc_data: certResult.enc_data,
          integrity_value: certResult.integrity_value,
          token_version_id: certResult.token_version_id,
        },
      });
    } catch (error) {
      console.error("NICE Auth Request Error:", error);
      res.status(500).json({
        success: false,
        message: "인증 요청 처리 중 오류가 발생했습니다.",
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
