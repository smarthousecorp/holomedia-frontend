import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { Creator } from "../../types/user";
import { board } from "../../types/board";
import { useTranslation } from "../../utils/translation_google";
import { Button } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import i18n from "../../i18n";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { SvgIcon } from "@mui/material";
// import LikeButton from "./LikeButton";

interface MovieListProps {
  creators: Creator[];
  onCreatorClick: (creator: Creator) => void;
  boards: board[];
  onBoardClick: (board: board) => void;
  shouldBlur: boolean;
}

const MovieList: React.FC<MovieListProps> = ({
  creators,
  onCreatorClick,
  boards,
  onBoardClick,
  shouldBlur,
}) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>(
    []
  );
  // 이미지 갤러리 상태 관리
  const [selectedImageGallery, setSelectedImageGallery] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);

  const [showExpandButtons, setShowExpandButtons] = useState<{
    [key: number]: boolean;
  }>({});
  const quillRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [translatedContents, setTranslatedContents] = useState<{
    [key: number]: string;
  }>({});
  const [isTranslating, setIsTranslating] = useState<{
    [key: number]: boolean;
  }>({});
  const [isTranslated, setIsTranslated] = useState<{ [key: number]: boolean }>(
    {}
  );
  const { translate } = useTranslation();

  // 탭이 변경될 때 번역된 내용 초기화
  useEffect(() => {
    setTranslatedContents({});
    setIsTranslated({});
  }, [shouldBlur]);

  const findCreator = (id: number) => {
    return creators.find((creator) => creator.no === id);
  };

  const handleCreatorClick = (creator: Creator): void => {
    onCreatorClick(creator);
  };

  const handleBoardClick = (board: board): void => {
    if (shouldBlur) {
      // 유료 콘텐츠(영상)인 경우 기존 로직 유지
      onBoardClick(board);
    } else {
      // 무료 콘텐츠(이미지)인 경우 갤러리 오픈
      // 여러 이미지를 배열로 가정. 실제 데이터 구조에 맞게 수정 필요
      const images = Array.isArray(board.urls.image)
        ? board.urls.image
        : [board.urls.image];

      setSelectedImageGallery({
        images,
        currentIndex: 0,
      });
    }
  };

  const handleGalleryClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedImageGallery(null);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageGallery) {
      setSelectedImageGallery({
        ...selectedImageGallery,
        currentIndex: Math.max(0, selectedImageGallery.currentIndex - 1),
      });
    }
  };

  const handleNextImage = () => {
    if (selectedImageGallery) {
      setSelectedImageGallery({
        ...selectedImageGallery,
        currentIndex: Math.min(
          selectedImageGallery.images.length - 1,
          selectedImageGallery.currentIndex + 1
        ),
      });
    }
  };

  const toggleDescription = (boardId: number) => {
    setExpandedDescriptions((prev) =>
      prev.includes(boardId)
        ? prev.filter((id) => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handleTranslateContent = async (boardId: number, content: string) => {
    if (!content) {
      console.log("번역할 내용이 없습니다.");
      return;
    }

    console.log("번역 시작:", { boardId, content });
    setIsTranslating((prev) => ({ ...prev, [boardId]: true }));

    try {
      // i18n 언어 코드를 Google Cloud Translation API 언어 코드로 변환
      const getGoogleLanguageCode = (lang: string) => {
        switch (lang) {
          case "ko":
            return "ko";
          case "en":
            return "en";
          case "jp":
            return "ja";
          case "zh":
            return "zh";
          default:
            return "en";
        }
      };

      const targetLang = getGoogleLanguageCode(i18n.language);
      console.log("번역 시도:", { targetLang, content });

      const translated = await translate(content, targetLang);
      console.log("번역 결과:", translated);

      const formattedContent = translated
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">");

      setTranslatedContents((prev) => ({
        ...prev,
        [boardId]: formattedContent,
      }));

      // 번역 완료 상태 설정
      setIsTranslated((prev) => ({
        ...prev,
        [boardId]: true,
      }));
    } catch (error) {
      console.error("번역 실패:", error);
    } finally {
      setIsTranslating((prev) => ({ ...prev, [boardId]: false }));
    }
  };

  useEffect(() => {
    // 각 게시글의 내용 높이를 체크하여 expandButton 표시 여부 결정
    boards.forEach((board) => {
      const quillElement =
        quillRefs.current[board.boardNo]?.querySelector(".ql-editor");
      if (quillElement) {
        const contentHeight = quillElement.scrollHeight;
        const MAX_HEIGHT = 72; // 4.8rem = 72px (assuming 1rem = 15px)

        setShowExpandButtons((prev) => ({
          ...prev,
          [board.boardNo]: contentHeight > MAX_HEIGHT,
        }));
      }
    });
  }, [boards]);

  return (
    <>
      {boards.map((board) => {
        const creator = findCreator(board.creatorNo);
        const isExpanded = expandedDescriptions.includes(board.boardNo);
        const isVideo = shouldBlur;
        const mediaUrl = isVideo ? board.urls.thumbnail : board.urls.image;
        const shouldApplyBlur = isVideo && !board.paid && board.point !== 0;
        const content = isVideo ? board.contents.video : board.contents.image;

        if (!creator || !mediaUrl) return null;

        return (
          <BoardLists key={board.boardNo}>
            <BoardItem>
              <PostHeader>
                <CreatorInfo onClick={() => handleCreatorClick(creator)}>
                  <ProfileImage
                    src={creator.profile || "/default-profile.png"}
                    alt={creator.nickname || "Profile"}
                  />
                  <CreatorItem>
                    <CreatorName>{creator.nickname}</CreatorName>
                    <CreatorId>@{creator.loginId}</CreatorId>
                  </CreatorItem>
                </CreatorInfo>
                <StyledQuillWrapper $isExpanded={isExpanded}>
                  <div
                    className="quill-container"
                    ref={(el) => (quillRefs.current[board.boardNo] = el)}
                  >
                    <ReactQuill
                      value={translatedContents[board.boardNo] || content}
                      readOnly={true}
                      theme="bubble"
                      modules={{
                        toolbar: false,
                      }}
                    />
                  </div>
                  <ButtonContainer>
                    <TranslateButton
                      variant="outlined"
                      startIcon={<TranslateIcon />}
                      onClick={() =>
                        handleTranslateContent(board.boardNo, content)
                      }
                      disabled={isTranslating[board.boardNo] || !content}
                      size="small"
                    >
                      {isTranslating[board.boardNo]
                        ? "번역 중..."
                        : isTranslated[board.boardNo]
                        ? "번역됨"
                        : "번역하기"}
                    </TranslateButton>
                    {showExpandButtons[board.boardNo] && (
                      <ExpandButton
                        onClick={() => toggleDescription(board.boardNo)}
                      >
                        {isExpanded ? "접기" : "더보기"}
                      </ExpandButton>
                    )}
                  </ButtonContainer>
                </StyledQuillWrapper>
              </PostHeader>

              <BoardContent onClick={() => handleBoardClick(board)}>
                <BoardThumbnail
                  src={mediaUrl}
                  alt={board.title}
                  $shouldBlur={shouldApplyBlur}
                />
                {shouldApplyBlur && (
                  <BlurOverlay>
                    <h3>이 영상 구매하기</h3>
                    <button>{board.point}꿀</button>
                  </BlurOverlay>
                )}
              </BoardContent>

              <PostFooter>
                <Interactions>{/* 기존 인터렉션 요소들 */}</Interactions>
              </PostFooter>
            </BoardItem>
          </BoardLists>
        );
      })}

      {selectedImageGallery && (
        <ImageGalleryOverlay onClick={handleGalleryClose}>
          <GalleryContent>
            <GalleryImage
              src={
                selectedImageGallery.images[selectedImageGallery.currentIndex]
              }
              alt="Gallery"
            />
            {selectedImageGallery.images.length > 1 && (
              <GalleryNavigation>
                <NavButton
                  onClick={handlePrevImage}
                  disabled={selectedImageGallery.currentIndex === 0}
                >
                  &#10094;
                </NavButton>
                <GalleryCounter>
                  {selectedImageGallery.currentIndex + 1} /{" "}
                  {selectedImageGallery.images.length}
                </GalleryCounter>
                <NavButton
                  onClick={handleNextImage}
                  disabled={
                    selectedImageGallery.currentIndex ===
                    selectedImageGallery.images.length - 1
                  }
                >
                  &#10095;
                </NavButton>
              </GalleryNavigation>
            )}
          </GalleryContent>
        </ImageGalleryOverlay>
      )}
    </>
  );
};

export default MovieList;

const StyledQuillWrapper = styled.div<{ $isExpanded: boolean }>`
  margin-top: 2rem;
  position: relative;

  .quill-container {
    max-height: ${(props) => (props.$isExpanded ? "none" : "4.8rem")};
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
    padding-right: ${(props) => (props.$isExpanded ? "0" : "4rem")};

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
    max-width: 400px;
  }

  &:hover {
    text-decoration: underline;
  }
`;

// boardDescription 스타일 컴포넌트는 제거 (Quill로 대체)

const BoardLists = styled.ul`
  position: relative;
  max-width: 100%;
  background: #ffffff;
  border-radius: 17px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BoardItem = styled.li`
  border-radius: 12px;
  overflow: hidden;
`;

const PostHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const CreatorInfo = styled.div`
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

const CreatorItem = styled.div`
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

const CreatorName = styled.span`
  font-weight: 600;
  font-size: 1.3rem;
  color: #333;
`;

const CreatorId = styled.span`
  color: #828282;
`;

const BoardContent = styled.div`
  cursor: pointer;
  position: relative;
  padding-top: 67.25%; // 16:9 Aspect Ratio (이미지 사이즈가 각기 다른 관계로 56.25 => 67.25 변경)
`;

const BoardThumbnail = styled.img<{ $shouldBlur: boolean }>`
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

const ImageGalleryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const GalleryContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const GalleryImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const GalleryNavigation = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;

  &:disabled {
    color: #666;
    cursor: not-allowed;
  }
`;

const GalleryCounter = styled.div`
  color: white;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 1rem;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const TranslateButton = styled(Button)`
  && {
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
  }
`;

// const PlayIcon = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   width: 0;
//   height: 0;
//   border-style: solid;
//   border-width: 15px 0 15px 25px;
//   border-color: transparent transparent transparent #ffffff;
//   opacity: 0.8;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     width: 60px;
//     height: 60px;
//     background: rgba(0, 0, 0, 0.5);
//     border-radius: 50%;
//     z-index: -1;
//   }
// `;

// const InteractionItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.25rem;

//   > svg {
//     font-size: 2.2rem;
//   }
// `;

// const Count = styled.span`
//   color: #666;
//   font-size: 1.5rem;
// `;

// const boardTitle = styled.h3`
//   margin: 0.5rem 0;
//   font-size: 1.1rem;
//   font-weight: 600;
// `;

// const boardDescription = styled.p`
//   margin: 0;
//   margin-top: 2rem;
//   color: #000000;
//   font-size: 1.2rem;
//   line-height: 1.4;
// `;
