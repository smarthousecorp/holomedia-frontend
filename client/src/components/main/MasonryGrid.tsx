import React from "react";
import { Eye } from "lucide-react";
import styled from "styled-components";
import { media } from "../../types/media";
import { Creator } from "../../types/user";
import adultBadge from "../../assets/19_badge.png";

interface MasonryGridProps {
  boards: media[];
  creators: Creator[];
  onCreatorClick: (creator: Creator) => void;
  onBoardClick: (board: media) => void;
  shouldBlur: boolean;
}

interface GridItemProps {
  $isCreator: boolean;
}

interface GradientOverlayProps {
  $position: "top" | "bottom";
}

interface ImageProps {
  $shouldBlur?: boolean;
}

interface MixedContent {
  type: "creator" | "board";
  content: Creator | media;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  boards,
  creators,
  onCreatorClick,
  onBoardClick,
  shouldBlur,
}) => {
  const createMixedContent = (): MixedContent[] => {
    const mixed: MixedContent[] = [];
    let boardIndex = 0;
    let creatorIndex = 0;
    let position = 0;

    while (boardIndex < boards.length || creatorIndex < creators.length) {
      if (position % 4 === 2 && creatorIndex < creators.length) {
        mixed.push({
          type: "creator",
          content: creators[creatorIndex++],
        });
      } else if (boardIndex < boards.length) {
        mixed.push({
          type: "board",
          content: boards[boardIndex++],
        });
      } else if (creatorIndex < creators.length) {
        mixed.push({
          type: "creator",
          content: creators[creatorIndex++],
        });
      }
      position++;
    }
    return mixed;
  };

  const findCreator = (creatorNo: number): Creator | undefined => {
    return creators.find((creator) => creator.no === creatorNo);
  };

  const handleCardClick = (item: MixedContent) => {
    if (item.type === "creator") {
      onCreatorClick(item.content as Creator);
    } else {
      onBoardClick(item.content as media);
    }
  };

  return (
    <GridContainer>
      {createMixedContent().map((item, index) => (
        <GridItem key={index} $isCreator={item.type === "creator"}>
          <Card onClick={() => handleCardClick(item)}>
            <ImageContainer>
              <Image
                src={
                  item.type === "creator"
                    ? "/default-profile.png" // You might want to add profile_image to Creator type
                    : (item.content as media).urls.thumbnail
                }
                alt={
                  item.type === "creator"
                    ? (item.content as Creator).nickname
                    : (item.content as media).title
                }
                $shouldBlur={item.type === "board" && shouldBlur}
              />

              {item.type === "creator" ? (
                <GradientOverlay $position="bottom">
                  <Username>{(item.content as Creator).nickname}</Username>
                  <CreatorStats>
                    <span>@{(item.content as Creator).loginId}</span>
                    <span>{(item.content as Creator).content}</span>
                  </CreatorStats>
                </GradientOverlay>
              ) : (
                <>
                  <GradientOverlay $position="top">
                    <CreatorInfo>
                      {(() => {
                        const creator = findCreator(
                          (item.content as media).creatorNo
                        );
                        return (
                          <>
                            <ProfileImage
                              src="/default-profile.png"
                              alt="profile"
                            />
                            <Username>{creator?.nickname}</Username>
                          </>
                        );
                      })()}
                    </CreatorInfo>
                  </GradientOverlay>

                  <GradientOverlay $position="bottom">
                    <Stats>
                      <StatItem>
                        <Eye size={16} />
                        <span>0</span>{" "}
                        {/* Add view count to BoardItem if available */}
                      </StatItem>
                    </Stats>
                  </GradientOverlay>

                  {shouldBlur && (
                    <BlurOverlay>
                      <Badge src={adultBadge} alt="19금 딱지" />
                    </BlurOverlay>
                  )}
                </>
              )}
            </ImageContainer>
          </Card>
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default MasonryGrid;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1364px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const GridItem = styled.div<GridItemProps>`
  width: 100%;
  grid-row-end: ${(props) => (props.$isCreator ? "span 1" : "span 2")};
  aspect-ratio: ${(props) => (props.$isCreator ? "1/1" : "1/2")};
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Image = styled.img<ImageProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) =>
    props.$shouldBlur &&
    `
    filter: blur(16px);
  `}
`;

const GradientOverlay = styled.div<GradientOverlayProps>`
  position: absolute;
  left: 0;
  right: 0;
  padding: 1rem;
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

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.span`
  color: white;
  font-weight: 500;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BlurOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.5);
`;

const Badge = styled.img`
  width: 3rem;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 6;
`;

const CreatorStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
`;
