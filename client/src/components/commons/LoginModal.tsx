import styled from "styled-components";

const LoginModal = () => {
  return (
    <Background>
      <ModalContainer>hi</ModalContainer>
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
  width: 43rem;
  height: 53rem;
  background-color: #ffffff;
  border-radius: 17px;
  border: 1px solid gray;
  display: flex;
  gap: 1rem;
  padding: 6rem 2rem;
`;
