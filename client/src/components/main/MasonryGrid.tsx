// main/MasonryGrid.tsx
import React from "react";
import styled from "styled-components";
import { Eye, ThumbsUp } from "lucide-react";
import { media } from "../../types/media";
import { Uploader } from "../../types/user";
import badge from "../../assets/19_badge.png";

interface MasonryGridProps {
  medias: media[];
  uploaders: Uploader[];
  onUploaderClick: (uploader: Uploader) => void;
  onMediaClick: (media: media) => void;
  shouldBlur: boolean;
}

interface GridItemProps {
  $isUploader: boolean;
}

interface GradientOverlayProps {
  $position: "top" | "bottom";
}

interface ImageProps {
  $shouldBlur?: boolean;
}

interface MixedContent {
  type: "uploader" | "media";
  content: Uploader | media;
}

// const formatDate = (date: string | Date) => {
//   return new Date(date).toLocaleDateString("ko-KR", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// };

const MasonryGrid: React.FC<MasonryGridProps> = ({
  medias,
  uploaders,
  onUploaderClick,
  onMediaClick,
  shouldBlur,
}) => {
  const createMixedContent = (): MixedContent[] => {
    const mixed: MixedContent[] = [];
    let mediaIndex = 0;
    let uploaderIndex = 0;
    let position = 0;

    // 남은 미디어나 업로더가 있는 동안 계속
    while (mediaIndex < medias.length || uploaderIndex < uploaders.length) {
      // 업로더를 추가할 위치이고, 아직 추가할 업로더가 있는 경우
      if (position % 4 === 2 && uploaderIndex < uploaders.length) {
        mixed.push({
          type: "uploader",
          content: uploaders[uploaderIndex++],
        });
      }
      // 아직 추가할 미디어가 있는 경우
      else if (mediaIndex < medias.length) {
        mixed.push({
          type: "media",
          content: medias[mediaIndex++],
        });
      }
      // 남은 업로더가 있다면 마지막에 추가
      else if (uploaderIndex < uploaders.length) {
        mixed.push({
          type: "uploader",
          content: uploaders[uploaderIndex++],
        });
      }
      position++;
    }
    console.log("mixed", mixed);

    return mixed;
  };

  console.log("props", medias, uploaders);

  const findUploader = (uploaderId: number): Uploader | undefined => {
    return uploaders.find((uploader) => uploader.id === uploaderId);
  };

  const handleCardClick = (item: MixedContent) => {
    if (item.type === "uploader") {
      onUploaderClick(item.content as Uploader);
    } else {
      onMediaClick(item.content as media);
    }
  };

  return (
    <GridContainer>
      {createMixedContent().map((item, index) => (
        <GridItem key={index} $isUploader={item.type === "uploader"}>
          <Card onClick={() => handleCardClick(item)}>
            <ImageContainer>
              <Image
                src={
                  item.type === "uploader"
                    ? (item.content as Uploader).profile_image ||
                      "/default-profile.png"
                    : (item.content as media).thumbnail
                }
                alt={
                  item.type === "uploader"
                    ? (item.content as Uploader).username
                    : (item.content as media).title
                }
                $shouldBlur={item.type === "media" && shouldBlur}
              />

              {item.type === "uploader" ? (
                <GradientOverlay $position="bottom">
                  <Username>{(item.content as Uploader).username}</Username>
                  <UploaderStats>
                    <span>@{(item.content as Uploader).user_id}</span>
                    <span>
                      {(item.content as Uploader).media_count}개의 영상
                    </span>
                    <span>
                      총 조회수{" "}
                      {(item.content as Uploader).total_views.toLocaleString()}
                    </span>
                    {/* <span>
                      마지막 업로드:{" "}
                      {formatDate((item.content as Uploader).last_upload)}
                    </span> */}
                  </UploaderStats>
                </GradientOverlay>
              ) : (
                <>
                  <GradientOverlay $position="top">
                    <UploaderInfo>
                      {(() => {
                        const uploader = findUploader(
                          (item.content as media).uploader_id
                        );
                        return (
                          <>
                            <ProfileImage
                              src={
                                uploader?.profile_image ||
                                "/default-profile.png"
                              }
                              alt="profile"
                            />
                            <Username>{uploader?.username}</Username>
                          </>
                        );
                      })()}
                    </UploaderInfo>
                  </GradientOverlay>

                  <GradientOverlay $position="bottom">
                    <Stats>
                      <StatItem>
                        <Eye size={16} />
                        <span>
                          {(item.content as media).views.toLocaleString()}
                        </span>
                      </StatItem>
                      <StatItem>
                        <ThumbsUp
                          size={16}
                          fill={
                            (item.content as media).is_liked ? "white" : "none"
                          }
                        />
                        <span>{(item.content as media).like_count}</span>
                      </StatItem>
                    </Stats>
                  </GradientOverlay>

                  {shouldBlur && (
                    <BlurOverlay>
                      {/* <PurchaseTitle>이 영상만 구매</PurchaseTitle>
                      <PurchaseButton>
                        {(item.content as media).price.toLocaleString()}원으로
                        구매
                      </PurchaseButton> */}
                      <Badge src={badge} alt="19금 딱지" />
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
  /* grid-auto-rows: 1fr; */
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
  grid-row-end: ${(props) => (props.$isUploader ? "span 1" : "span 2")};
  aspect-ratio: ${(props) => (props.$isUploader ? "1/1" : "1/2")};
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

const UploaderInfo = styled.div`
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

// const PurchaseTitle = styled.h3`
//   color: white;
//   font-size: 1.25rem;
//   font-weight: bold;
// `;

// const PurchaseButton = styled.button`
//   padding: 0.5rem 1.5rem;
//   background-color: #ef4444;
//   color: white;
//   border-radius: 9999px;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #dc2626;
//   }
// `;

const UploaderStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
`;
