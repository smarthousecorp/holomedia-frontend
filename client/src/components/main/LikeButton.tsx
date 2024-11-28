import React, {useState} from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styled from "styled-components";
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

  const handleLike = async () => {
    try {
      const response = await api.post(`/media/like/${mediaId}`);
      console.log(response.data);

      if (response.data.status === "liked") {
        setLiked(true);
        setLikeCount(response.data.likeCount);
      } else {
        setLiked(false);
        setLikeCount(response.data.likeCount);
      }

      // 부모 컴포넌트에 좋아요 상태 업데이트 알림
      onLikeToggle?.(response.data.likeCount);
    } catch (error) {
      console.error("좋아요 토글 중 오류 발생", error);
      // 필요시 에러 핸들링 추가
    }
  };

  return (
    <InteractionItem onClick={handleLike}>
      {liked ? (
        <SvgIcon component={FavoriteIcon} color="error" />
      ) : (
        <SvgIcon component={FavoriteBorderIcon} />
      )}
      <Count>{likeCount}</Count>
    </InteractionItem>
  );
};

export default LikeButton;

const InteractionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  > svg {
    font-size: 2.2rem;
    cursor: pointer;
  }
`;

const Count = styled.span`
  color: #666;
  font-size: 1.5rem;
`;
