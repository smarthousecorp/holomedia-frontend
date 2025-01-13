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
    const hideUntil = localStorage.getItem("popupHideUntil");
    const shouldShow = !hideUntil || new Date(hideUntil) < new Date();
    setIsVisible(shouldShow);
  }, []);

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
    <Overlay>
      <PopupContainer>
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
`;

const PopupContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  padding: 0.25rem;
  border-radius: 9999px;
  color: #ffffff;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ImageContainer = styled.div`
  width: 500px;
  height: 500px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;
`;

const HideDayButton = styled.button`
  font-size: 0.875rem;
  color: #4b5563;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const CloseNormalButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #eb3553;
  color: white;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #374151;
  }
`;
