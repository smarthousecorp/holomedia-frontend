// module/NiceAuth.js
const crypto = require("crypto");
const axios = require("axios");
const session = require("express-session");
const qs = require("querystring");
const NiceCrypto = require("./NiceCrypto");
const niceConfig = require("../config/niceConfig");

class NiceAuth {
  constructor() {
    this.clientId = niceConfig.clientId;
    this.clientSecret = niceConfig.clientSecret;
    this.productId = niceConfig.productId;
    this.baseUrl = niceConfig.baseUrl;
  }

  async getAccessToken() {
    try {
      const authorization = Buffer.from(
        this.clientId + ":" + this.clientSecret
      ).toString("base64");

      console.log("Debug - Config values:", {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        productId: this.productId,
        baseUrl: this.baseUrl,
      });

      const dataBody = {
        scope: "default",
        grant_type: "client_credentials",
      };

      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/digital/niceid/oauth/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authorization}`,
        },
        data: qs.stringify(dataBody),
      });

      return response.data.dataBody.access_token;
    } catch (error) {
      console.error("getAccessToken 상세 에러:", {
        에러메시지: error.message,
        응답데이터: error.response?.data,
        상태코드: error.response?.status,
        설정값체크: {
          baseUrl: this.baseUrl,
          clientId존재: !!this.clientId,
          clientSecret존재: !!this.clientSecret,
          productId존재: !!this.productId,
        },
      });
      throw error;
    }
  }

  async requestCertification(token, reqData) {
    try {
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
      };

      const nowDate = new Date();
      const req_dtim = formatDate(nowDate);
      const req_no = crypto.randomBytes(16).toString("hex").slice(0, 30);
      const current_timestamp = Math.floor(nowDate.getTime() / 1000);

      // Authorization 헤더 구성
      const authString = `${token}:${current_timestamp}:${this.clientId}`;
      const authorization = `bearer ${Buffer.from(authString).toString(
        "base64"
      )}`;

      const tokenResponse = await axios.post(
        `${this.baseUrl}/digital/niceid/api/v1.0/common/crypto/token`,
        {
          dataHeader: { CNTY_CD: "ko" },
          dataBody: { req_dtim, req_no, enc_mode: "1" },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
            ProductID: this.productId,
          },
        }
      );

      // tokenResponse에서 site_code 추출
      const site_code = tokenResponse.data.dataBody.site_code;
      const { token_val } = tokenResponse.data.dataBody;

      // reqData 재구성
      const finalReqData = {
        requestno: req_no,
        returnurl: "http://localhost:4000/nice/callback", // 클라이언트에서 전달받은 returnurl 사용
        sitecode: site_code, // token 응답에서 받은 site_code 사용
        methodtype: "get",
        popupyn: "Y",
        receivedata: "", // 필요한 경우 클라이언트에서 전달받은 값 사용
      };

      console.log("Debug - Request Data:", finalReqData); // 디버깅용

      // 대칭키 생성
      const value = `${req_dtim}${req_no}${token_val}`;
      const resultVal = crypto
        .createHash("sha256")
        .update(value)
        .digest("base64");

      const key = resultVal.substr(0, 16);
      const iv = resultVal.substr(resultVal.length - 16, resultVal.length - 1);
      const hmacKey = resultVal.substr(0, 32);

      // 데이터 암호화
      const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
      cipher.setAutoPadding(true);

      const encryptedData =
        cipher.update(JSON.stringify(finalReqData), "utf8", "base64") +
        cipher.final("base64");

      // 무결성 값 생성
      const hmac = crypto.createHmac("sha256", hmacKey);
      hmac.update(encryptedData);
      const integrityValue = hmac.digest("base64");

      session.niceAuthValues = {
        req_dtim,
        req_no,
        token_val,
        key,
        iv,
      };

      return {
        ...tokenResponse.data,
        enc_data: encryptedData,
        integrity_value: integrityValue,
      };
    } catch (error) {
      console.error("[Debug] Full error:", error);
      throw error;
    }
  }

  // 인증 결과 조회
  async getCertificationResult(token, tokenVersionId, encData, integrityValue) {
    try {
      const requestBody = {
        dataHeader: {
          CNTY_CD: "ko",
        },
        dataBody: {
          token_version_id: tokenVersionId,
          enc_data: encData,
          integrity_value: integrityValue,
        },
      };

      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/digital/niceid/api/v1.0/common/crypto/result`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: requestBody,
      });

      return response.data;
    } catch (error) {
      console.error("getCertificationResult Error:", error);
      throw error;
    }
  }
}

module.exports = NiceAuth;
