import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Uploader} from "../../types/user";
import {api} from "../../utils/api";

interface UploaderWithFollowStatus extends Uploader {
  isFollowing: boolean;
}

export const RecommendedUploaders: React.FC = () => {
  const [uploaders, setUploaders] = useState<UploaderWithFollowStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendedUploaders = async () => {
    try {
      const response = await api.get<{status: string; data: Uploader[]}>(
        "/recommended-uploaders"
      );

      // Add isFollowing field to each uploader
      const uploadersWithFollowStatus = response.data.data.map((uploader) => ({
        ...uploader,
        isFollowing: false,
      }));

      setUploaders(uploadersWithFollowStatus);
    } catch (error) {
      console.error("Failed to fetch recommended uploaders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (uploaderId: number) => {
    try {
      await api.post(`/follow/${uploaderId}`);
      // Update follow status instead of removing
      setUploaders((prev) =>
        prev.map((uploader) =>
          uploader.id === uploaderId
            ? {...uploader, isFollowing: true}
            : uploader
        )
      );
    } catch (error) {
      console.error("Failed to follow uploader:", error);
    }
  };

  useEffect(() => {
    fetchRecommendedUploaders();
  }, []);

  const formatLastUpload = (date: string) => {
    const uploadDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - uploadDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "어제";
    if (diffDays <= 7) return `${diffDays}일 전`;
    return uploadDate.toLocaleDateString();
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Title>블룸이들을 위한 추천</Title>
      <UploaderList>
        {uploaders.map((uploader) => (
          <UploaderItem key={uploader.id}>
            <UploaderInfo>
              <img
                src={uploader.profile_image || "default.png"}
                alt={uploader.username}
              />
              <UserDetails>
                <Username>{uploader.username}</Username>
                <UserId>@{uploader.user_id}</UserId>
                <LastUpload>
                  최근 업로드 : {formatLastUpload(uploader.last_upload)}
                </LastUpload>
              </UserDetails>
            </UploaderInfo>
            <FollowButton
              onClick={() => !uploader.isFollowing && handleFollow(uploader.id)}
              $isFollowing={uploader.isFollowing}
              disabled={uploader.isFollowing}
            >
              {uploader.isFollowing ? "팔로우 됨" : "팔로우"}
            </FollowButton>
          </UploaderItem>
        ))}
      </UploaderList>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5.8rem;
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 270px;
  max-height: 360px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0 0 16px 0;
  color: #333;
`;

const UploaderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UploaderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const UploaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const UserId = styled.span`
  font-size: 12px;
  color: #666;
`;

const LastUpload = styled.span`
  margin-top: 0.5rem;
  font-size: 10px;
  color: #666;
`;

const FollowButton = styled.button<{$isFollowing: boolean}>`
  padding: 6px 10px;
  border-radius: 20px;
  background-color: ${(props) => (props.$isFollowing ? "#e0e0e0" : "#EB3553")};
  color: ${(props) => (props.$isFollowing ? "#666" : "white")};
  border: none;
  font-size: 1.2rem;
  cursor: ${(props) => (props.$isFollowing ? "default" : "pointer")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$isFollowing ? "#e0e0e0" : "#f5627b "};
  }

  &:disabled {
    opacity: 1;
  }
`;
