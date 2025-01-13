import { useSearchParams } from "react-router-dom";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams);

  return <>결제 성공 ㅎㅎ</>;
};

export default PaymentReturn;
