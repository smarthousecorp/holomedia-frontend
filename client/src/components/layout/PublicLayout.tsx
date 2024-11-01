import {Outlet} from "react-router";
import {styled} from "styled-components";
import Header from "../commons/Header";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {view} from "../../store/slices/header";
import {Navigate} from "react-router-dom";
import {logout} from "../../store/slices/user";
import {getCookie} from "../../utils/cookie";

const PublicLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 해당 레이아웃이 마운트되면 무조건 햄버거 버튼이 보이게 설정
    dispatch(view());
  }, []);

  const isLoggedIn = () => {
    return localStorage.getItem("accessToken") || getCookie("accessToken");
  };

  if (!isLoggedIn()) {
    alert("로그인 후 접근 가능합니다.");
    dispatch(logout());
    localStorage.removeItem("accessToken");
    return <Navigate to="/" />;
  }

  return (
    <Full>
      <Header />
      <Inner>
        <Container>
          <Outlet />
        </Container>
      </Inner>
    </Full>
  );
};

const Full = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000000;
  padding-top: 8rem;
  display: flex;
`;

const Container = styled.main`
  width: 100%;
  border: 1px solid white;
  /* padding-left: 25rem; // sidebar가 있으면 그대로, 없어지면 0으로 해야함 (전역상태관리 사용 예정) */
`;

export default PublicLayout;
