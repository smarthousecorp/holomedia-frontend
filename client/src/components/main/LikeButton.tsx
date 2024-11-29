import React, {useState} from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styled, {keyframes} from "styled-components";
import {SvgIcon} from "@mui/material";
import {api} from "../../utils/api";

interface LikeButtonProps {
  mediaId: number;
  isLiked: boolean;
  initialLikeCount: number;
  onLikeToggle?: (newLikeCount: number) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  mediaId,
  isLiked,
  initialLikeCount,
  onLikeToggle,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [showFireworks, setShowFireworks] = useState(false);

  const createFireworks = () => {
    const fireworks = [];
    const numberOfParticles = 12;
    const radius = 20;

    for (let i = 0; i < numberOfParticles; i++) {
      const angle = (i * 2 * Math.PI) / numberOfParticles;
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;

      fireworks.push(
        <Firework
          key={i}
          style={{
            ["--tx" as any]: `${tx}px`,
            ["--ty" as any]: `${ty}px`,
          }}
        />
      );
    }
    return fireworks;
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/media/like/${mediaId}`);
      console.log(response.data);

      if (response.data.status === "liked") {
        setLiked(true);
        setLikeCount(response.data.likeCount);
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 600);
      } else {
        setLiked(false);
        setLikeCount(response.data.likeCount);
      }

      onLikeToggle?.(response.data.likeCount);
    } catch (error) {
      console.error("좋아요 토글 중 오류 발생", error);
    }
  };

  return (
    <InteractionItem onClick={handleLike}>
      <SvgIcon
        component={liked ? FavoriteIcon : FavoriteBorderIcon}
        className={liked ? "liked" : ""}
      />
      {showFireworks && (
        <FireworksContainer>{createFireworks()}</FireworksContainer>
      )}
      <Count>{likeCount}</Count>
    </InteractionItem>
  );
};

export default LikeButton;

const heartPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;

const fireWorkAnimation = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty));
    opacity: 0;
  }
`;

const Firework = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #ff3040;
  animation: ${fireWorkAnimation} 0.6s ease-out forwards;
`;

const InteractionItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  > svg {
    font-size: 2.2rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &.liked {
      animation: ${heartPulse} 0.5s ease-in-out;
      color: #ff3040;
    }
  }
`;

const Count = styled.span`
  color: #666;
  font-size: 1.5rem;
  transition: color 0.3s ease;
`;

const FireworksContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;
