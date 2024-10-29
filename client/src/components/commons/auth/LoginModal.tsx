import styled from "styled-components";
import {off} from "../../../store/slices/modal";
import {useDispatch} from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import {SvgIcon} from "@mui/material";
import React, {useState} from "react";
import Login from "./Login";
import SignUp from "./SignUp";

const LoginModal = () => {
  // 상단 nav 클릭 상태
  const [isClickedLogin, setIsClickedLogin] = useState<boolean>(true);

  // 로그인, 로그아웃 버튼 클릭 시 상태 변경 함수
  const handleClickSignup = () => {
    setIsClickedLogin(false);
  };
  const handleClickLogin = () => {
    setIsClickedLogin(true);
  };

  // 모달 사라지게 하는 전역상태 변경 함수
  const dispatch = useDispatch();
  const handleClickBG = () => {
    dispatch(off());
  };

  // 모달 클릭 시 꺼지지 않게 하는 함수
  const handleClickModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // 클릭 이벤트 전파 방지
  };

  return (
    <Background onClick={handleClickBG}>
      <ModalContainer onClick={handleClickModal}>
        <SvgIcon component={ClearIcon} />
        <Nav>
          <a onClick={handleClickLogin} className={isClickedLogin ? "on" : ""}>
            로그인
          </a>
          <a
            onClick={handleClickSignup}
            className={!isClickedLogin ? "on" : ""}
          >
            회원가입
          </a>
        </Nav>
        {isClickedLogin ? <Login /> : <SignUp />}
      </ModalContainer>
    </Background>
  );
};

export default LoginModal;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
  position: fixed;
  top: 0;
  left: 0;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  width: 36rem;
  background-color: #ffffff;
  border-radius: 17px;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 6rem 3.5rem;
  position: relative; // 자식 요소의 절대 위치를 기준으로 설정

  > svg {
    font-size: 3.2rem;
    position: absolute;
    right: 2rem;
    top: 2rem;
  }
`;

const Nav = styled.div`
  font-family: "Pretendard-Bold";
  display: flex;
  gap: 4rem;
  justify-content: center;
  border-bottom: 1px solid black;

  > a {
    position: relative;
    top: 0.4rem;
    width: 11rem;
    text-align: center;
    font-size: 1.8rem;
    padding-bottom: 1rem;
  }

  > .on {
    color: #ec3554;
    border-bottom: 6px solid #ec3554;
  }
`;
