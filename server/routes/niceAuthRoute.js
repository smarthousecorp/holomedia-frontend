// routes/niceAuthRoute.js
const express = require("express");
const router = express.Router();
const niceAuthController = require("../controllers/niceAuthController");

  router.post('/auth/verify', async (req, res) => {
    try {
      const { token_version_id, enc_data, integrity_value } = req.body;
      const niceAuth = new NiceAuth();
      const accessToken = await niceAuth.getAccessToken();
      
      const result = await niceAuth.getCertificationResult(
        accessToken, 
        token_version_id,
        enc_data,
        integrity_value
      );
  
      const birthDate = result.dataBody.birthdate;
      const age = calculateAge(birthDate); // 나이 계산 함수 필요
  
      res.json({
        success: true,
        age,
        data: result.dataBody
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "인증 확인 실패"
      });
    }
  });

router.post("/request", niceAuthController.requestAuth);
router.post("/verify", niceAuthController.verifyAuth);

module.exports = router;
