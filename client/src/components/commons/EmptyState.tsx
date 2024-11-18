import {FolderOpen} from "lucide-react";
import styled, {keyframes} from "styled-components";

const EmptyState = ({message = "등록된 영상이 없습니다."}) => {
  return (
    <EmptyContainer>
      <IconWrapper>
        <FolderOpen size={48} />
      </IconWrapper>
      <MessageTitle>{message}</MessageTitle>
      <MessageSubtitle>나중에 다시 확인해 주세요</MessageSubtitle>
    </EmptyContainer>
  );
};

export default EmptyState;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 85vh;
  min-height: 400px;
  border-radius: 10px;
  /* background-color: #171717; */
  animation: ${fadeIn} 0.6s ease-out;
  padding: 2rem;
`;

const IconWrapper = styled.div`
  margin-bottom: 2rem;
  color: #666666;
  animation: ${bounce} 2s ease-in-out infinite;

  svg {
    width: 48px;
    height: 48px;
    stroke-width: 1.5px;
  }
`;

const MessageTitle = styled.h3`
  font-size: 2.2rem;
  color: #666666;
  margin-bottom: 1rem;
  text-align: center;
  font-family: "Pretendard-Light";
`;

const MessageSubtitle = styled.p`
  font-size: 1.4rem;
  color: #4d4d4d;
  text-align: center;
  font-family: "Pretendard-Light";
`;
