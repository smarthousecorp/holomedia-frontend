import React, { useState } from "react";
import styled from "styled-components";
import { Eye } from "lucide-react";
import { board } from "../../types/board";
import { Creator } from "../../types/user";

interface ContentGridProps {
  boards: board[];
  creators: Creator[];
  onCreatorClick: (creator: Creator) => void;
  onBoardClick?: (board: board) => void;
  shouldBlur: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  boards,
  creators,
  onCreatorClick,
  // onBoardClick,
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
            // onClick={() => onBoardClick(board)}
            onClick={() => onCreatorClick(findCreator(board.creatorNo)!)}
          >
            <VideoWrapper>
              {hoveredVideo === board.boardNo ? (
                <VideoPlayer src={board.urls.highlight} autoPlay muted loop />
              ) : (
                <>
                  <ThumbnailImage
                    src={board.urls.thumbnail}
                    alt={board.title}
                    $shouldBlur={shouldBlur && board.point !== 0 && !board.paid}
                    $isFree={board.point === 0}
                  />
                  <PlayIconContainer>
                    <FilledPlayIcon />
                  </PlayIconContainer>
                  {board.point === 0 && <FreeLabel>free</FreeLabel>}
                </>
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
                  onClick={() => onCreatorClick(findCreator(board.creatorNo)!)}
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
                  <Image src={findCreator(board.creatorNo)?.profile} />
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
    transform: translateY(-4px);
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ThumbnailImage = styled.img<{ $shouldBlur: boolean; $isFree: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${(props) => (props.$shouldBlur ? "blur(6px)" : "none")};
  transition: filter 0.3s ease;
`;

// 재생 아이콘 컨테이너 추가
const PlayIconContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: rgba(255, 255, 255);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
`;

// 빨간색으로 채워진 재생 아이콘 (SVG 사용)
const FilledPlayIcon = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 18px;
  border-color: transparent transparent transparent #ff0000;
  margin-left: 4px; /* 시각적 중앙 정렬을 위해 약간 오른쪽으로 이동 */
`;

const FreeLabel = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@300;400;500;600;700;800;900&display=swap");
  font-family: "Inknut Antiqua", serif;
  font-weight: bold;
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  -webkit-text-stroke: 1px black;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 6rem;
  z-index: 2;
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

  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
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
  cursor: pointer;
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

  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
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
