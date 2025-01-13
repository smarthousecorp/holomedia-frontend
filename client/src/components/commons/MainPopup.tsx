import { useState, useEffect } from "react";
import styled from "styled-components";
import { X } from "lucide-react";

interface MainPopupProps {
  imageUrl: string;
  onClose: () => void;
}

const MainPopup = ({ imageUrl, onClose }: MainPopupProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // 현재 URL이 메인 페이지인지 확인
    const isMainPage = window.location.pathname === "/main";

    if (isMainPage) {
      const hideUntil = localStorage.getItem("popupHideUntil");
      const shouldShow = !hideUntil || new Date(hideUntil) < new Date();
      setIsVisible(shouldShow);
    }
  }, [window.location.pathname]); // URL 변경 감지

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleHideForDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    localStorage.setItem("popupHideUntil", tomorrow.toISOString());
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Overlay onClick={handleClose}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose} aria-label="Close popup">
          <X size={24} />
        </CloseButton>

        <ImageContainer>
          <img src={imageUrl} alt="Popup content" />
        </ImageContainer>

        <ButtonContainer>
          <HideDayButton onClick={handleHideForDay}>
            오늘 하루 보지 않기
          </HideDayButton>
          <CloseNormalButton onClick={handleClose}>닫기</CloseNormalButton>
        </ButtonContainer>
      </PopupContainer>
    </Overlay>
  );
};

export default MainPopup;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const PopupContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 500px;
  max-width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  padding: 0.25rem;
  border-radius: 9999px;
  color: #ffffff;
  transition: background-color 0.2s;
  z-index: 1;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 900px) {
    right: 0.25rem;
    top: 0.25rem;
  }
`;

const ImageContainer = styled.div`
  width: 500px;
  height: 500px;

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  padding: 1rem 1rem 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 900px) {
    padding: 1rem;
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

const HideDayButton = styled.button`
  font-size: 1.3rem;
  color: #4b5563;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }

  @media (max-width: 900px) {
    font-size: 1.1rem;
    width: 100%;
    padding: 0.5rem;
  }
`;

const CloseNormalButton = styled.button`
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  background-color: #eb3553;
  color: white;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f55e77;
  }

  @media (max-width: 900px) {
    font-size: 1.1rem;
    width: 100%;
    padding: 0.75rem;
  }
`;
