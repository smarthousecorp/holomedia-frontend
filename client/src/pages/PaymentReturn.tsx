import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentReturn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 창이 팝업인지 확인
    const isPopup = window.opener && !window.opener.closed;

    if (isPopup) {
      // 부모 창이 존재하면 성공 URL로 이동시키기
      if (window.opener) {
        window.opener.location.href = "/payment/success";
      }
      // 현재 팝업 창 닫기
      window.close();
    } else {
      // 팝업이 아닌 경우 일반적인 리다이렉트
      navigate("/payment/success", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default PaymentReturn;
