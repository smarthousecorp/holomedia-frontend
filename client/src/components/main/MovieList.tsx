import React, { useState } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { Uploader } from "../../types/user";
import { media } from "../../types/media";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SvgIcon } from "@mui/material";
import LikeButton from "./LikeButton";

interface MovieListProps {
  uploaders: Uploader[];
  onUploaderClick: (uploader: Uploader) => void;
  medias: media[];
  onMediaClick: (media: media) => void;
  shouldBlur: boolean;
}

const MovieList: React.FC<MovieListProps> = ({
  uploaders,
  onUploaderClick,
  medias,
  onMediaClick,
  shouldBlur,
}) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>([]);

  const findUploaderIdx = (id: number) => {
    return uploaders.filter((uploader) => {
      return uploader.id === id;
    })[0];
  };

  const handleUploaderClick = (uploader: Uploader): void => {
    onUploaderClick(uploader);
  };

  const handleMediaClick = (media: media): void => {
    onMediaClick(media);
  };

  const toggleDescription = (mediaId: number) => {
    setExpandedDescriptions(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  return (
    <>
      {medias.map((media) => {
        const uploader = findUploaderIdx(media.uploader_id);
        const isExpanded = expandedDescriptions.includes(media.id);

        return (
          <MediaLists key={media.id}>
            <MediaItem>
              <PostHeader>
                <UploaderInfo onClick={() => handleUploaderClick(uploader)}>
                  <ProfileImage
                    src={uploader.profile_image || "/default-profile.png"}
                    alt={uploader.username || "Profile"}
                  />
                  <UploaderItem>
                    <UploaderName>{uploader.username}</UploaderName>
                    <UploaderId>@{uploader.user_id}</UploaderId>
                  </UploaderItem>
                </UploaderInfo>
                <StyledQuillWrapper $isExpanded={isExpanded}>
                  <div className="quill-container">
                    <ReactQuill
                      value={media.description}
                      readOnly={true}
                      theme="bubble"
                      modules={{
                        toolbar: false,
                      }}
                    />
                  </div>
                  <ExpandButton onClick={() => toggleDescription(media.id)}>
                    {isExpanded ? "접기" : "더보기"}
                  </ExpandButton>
                </StyledQuillWrapper>
              </PostHeader>

              <MediaContent onClick={() => handleMediaClick(media)}>
                <MediaThumbnail
                  src={media.thumbnail}
                  alt={media.title}
                  $shouldBlur={shouldBlur}
                />
                {shouldBlur && (
                  <BlurOverlay>
                    <h3>이 영상만 구매</h3>
                    <button>???로 구매</button>
                  </BlurOverlay>
                )}
              </MediaContent>

              <PostFooter>
                <Interactions>
                  <LikeButton
                    mediaId={media.id}
                    isLiked={media.is_liked}
                    initialLikeCount={media.like_count}
                  />
                  <InteractionItem>
                    <SvgIcon component={VisibilityIcon} />
                    <Count>{media.views}</Count>
                  </InteractionItem>
                </Interactions>
              </PostFooter>
            </MediaItem>
          </MediaLists>
        );
      })}
    </>
  );
};

export default MovieList;

const StyledQuillWrapper = styled.div<{ $isExpanded: boolean }>`
  margin-top: 2rem;
  position: relative;

  .quill-container {
    max-height: ${props => props.$isExpanded ? 'none' : '4.8rem'};
    overflow: hidden;
  }

  .ql-container {
    font-family: inherit;
  }

  .ql-editor {
    padding: 0;
    font-size: 1.2rem;
    line-height: 1.4;
    color: #000000;
    padding-right: ${props => props.$isExpanded ? '0' : '4rem'};

    p {
      margin: 0;
    }
  }

  .ql-bubble .ql-editor a {
    color: #007aff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ExpandButton = styled.button`
  position: relative;
  width: 100%;
  margin: 1rem 0 0 0;
  padding: 0;
  background: none;
  border: none;
  color: #007aff;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e0e0e0;
    max-width: 350px;
  }

  &:hover {
    text-decoration: underline;
  }
`;

// MediaDescription 스타일 컴포넌트는 제거 (Quill로 대체)

const MediaLists = styled.ul`
  position: relative;
  max-width: 100%;
  background: #ffffff;
  border-radius: 17px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MediaItem = styled.li`
  border-radius: 12px;
  overflow: hidden;
`;

const PostHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const UploaderInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }
`;

const UploaderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const UploaderName = styled.span`
  font-weight: 600;
  font-size: 1.3rem;
  color: #333;
`;

const UploaderId = styled.span`
  color: #828282;
`;

const MediaContent = styled.div`
  cursor: pointer;
  position: relative;
  padding-top: 67.25%; // 16:9 Aspect Ratio (이미지 사이즈가 각기 다른 관계로 56.25 => 67.25 변경)
`;

const MediaThumbnail = styled.img<{$shouldBlur: boolean}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${(props) => (props.$shouldBlur ? "blur(10px)" : "none")};
  transition: filter 0.3s ease;
`;

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  z-index: 1;
  gap: 1rem;

  h3 {
    font-size: 1.6rem;
    margin: 0;
  }

  button {
    margin: 0;
    font-size: 1.4rem;
    color: #eee;
    padding: 10px 18px;
    border-radius: 20px;
    background-color: #eb3553;
    transition: background-color 0.2s;

    &:hover {
      background-color: "#f5627b";
    }
  }
`;

const PostFooter = styled.div`
  padding: 2rem;
`;

const Interactions = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
`;

const InteractionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  > svg {
    font-size: 2.2rem;
  }
`;

const Count = styled.span`
  color: #666;
  font-size: 1.5rem;
`;

// const MediaTitle = styled.h3`
//   margin: 0.5rem 0;
//   font-size: 1.1rem;
//   font-weight: 600;
// `;

// const MediaDescription = styled.p`
//   margin: 0;
//   margin-top: 2rem;
//   color: #000000;
//   font-size: 1.2rem;
//   line-height: 1.4;
// `;
