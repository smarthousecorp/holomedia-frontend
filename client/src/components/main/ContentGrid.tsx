import React, { useState } from "react";
import styled from "styled-components";
import { Eye } from "lucide-react";
import { board } from "../../types/board";
import { Creator } from "../../types/user";

interface ContentGridProps {
  boards: board[];
  creators: Creator[];
  onCreatorClick: (creator: Creator) => void;
  onBoardClick: (board: board) => void;
  shouldBlur: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  boards,
  creators,
  onCreatorClick,
  onBoardClick,
  shouldBlur,
}) => {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

  const findCreator = (creatorNo: number): Creator | undefined => {
    return creators.find((creator) => creator.no === creatorNo);
  };

  console.log(boards);

  return (
    <GridContainer>
      {boards.map((board) => (
        <ContentRow key={board.boardNo}>
          {/* 왼쪽 세로형 비디오 섹션 */}
          <VideoSection
            onMouseEnter={() => setHoveredVideo(board.boardNo)}
            onMouseLeave={() => setHoveredVideo(null)}
            onClick={() => onBoardClick(board)}
          >
            <VideoWrapper>
              {hoveredVideo === board.boardNo ? (
                <VideoPlayer src={board.urls.highlight} autoPlay muted loop />
              ) : (
                <ThumbnailImage
                  src={board.urls.thumbnail}
                  alt={board.title}
                  $shouldBlur={shouldBlur}
                />
              )}
            </VideoWrapper>

            <GradientOverlay $position="top">
              <CreatorInfo>
                <ProfileImageWrapper>
                  <ProfileImage
                    src={findCreator(board.creatorNo)?.profile}
                    alt="profile"
                  />
                </ProfileImageWrapper>
                <CreatorName>
                  {findCreator(board.creatorNo)?.nickname}
                </CreatorName>
              </CreatorInfo>
            </GradientOverlay>

            <GradientOverlay $position="bottom">
              <Stats>
                <StatItem>
                  <Eye size={16} />
                  <span>0</span>
                </StatItem>
              </Stats>
            </GradientOverlay>
          </VideoSection>

          {/* 오른쪽 컨텐츠 컬럼 */}
          <RightColumn>
            {/* 정사각형 이미지 섹션 */}
            <ImageSection>
              <ImageWrapper>
                <ContentImage
                  src={board.urls.image}
                  alt="content"
                  $shouldBlur={shouldBlur}
                />
              </ImageWrapper>
            </ImageSection>

            {/* 크리에이터 프로필 섹션 */}
            <CreatorSection
              onClick={() => onCreatorClick(findCreator(board.creatorNo)!)}
            >
              <CreatorContent>
                <ImageWrapper>
                  <Image src="https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/HOLOMEDIA%2Fsample3.jpg?alt=media&token=3ea497ba-1898-4a81-acf8-3bef130d6f7e" />
                </ImageWrapper>
                <GradientOverlay $position="bottom">
                  <Username>{findCreator(board.creatorNo)?.nickname}</Username>
                  <UploaderStats>
                    <span>@{findCreator(board.creatorNo)?.loginId}</span>
                    <span>1개의 영상</span>
                    <span>총 조회수 0</span>
                  </UploaderStats>
                </GradientOverlay>
              </CreatorContent>
            </CreatorSection>
          </RightColumn>
        </ContentRow>
      ))}
    </GridContainer>
  );
};

export default ContentGrid;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 620px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ThumbnailImage = styled.img<{ $shouldBlur: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) => props.$shouldBlur && `filter: blur(6px);`}
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RightColumn = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 0.5rem;
  height: 100%;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ContentImage = styled.img<{ $shouldBlur: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CreatorSection = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const CreatorContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
`;

const UploaderStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
`;

const GradientOverlay = styled.div<{ $position: "top" | "bottom" }>`
  position: absolute;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 5;

  ${(props) =>
    props.$position === "top" &&
    `
    top: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  `}

  ${(props) =>
    props.$position === "bottom" &&
    `
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  `}
`;

const Username = styled.span`
  color: white;
  font-weight: 500;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileImageWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CreatorName = styled.span`
  color: white;
  font-weight: 500;
  font-size: 1.125rem;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
`;
