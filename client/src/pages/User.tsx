import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import ReactQuill from "react-quill";
import { api } from "../utils/api";
import Toast from "../components/commons/Toast";
import { ToastType } from "../types/toast";
import Loading from "../components/commons/Loading";
import EmptyState from "../components/commons/EmptyState";
import MovieList from "../components/main/MovieList";
// import { RecommendedUploaders } from "../components/main/RecommendList";
import { Creator } from "../types/user";
import { board } from "../types/board";
import PointUseModal from "../components/commons/media/PointUseModal";
import { useTranslation } from "../utils/translation_google";
import { Button } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import i18n from "../i18n";

type LoadingState = "loading" | "error" | "success";
type TabType = "free" | "premium";

const User = () => {
  const navigate = useNavigate();
  const creatorNo = useParams().id;

  // const isAdultVerified = useSelector(
  //   (state: RootState) => state.user.is_adult_verified
  // );
  // const isAdmin = useSelector((state: RootState) => state.user.is_admin);

  // const shouldBlur = !isAdmin && (!user || !isAdultVerified);

  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [activeTab, setActiveTab] = useState<TabType>("free");
  const [boards, setBoards] = useState<board[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [creator, setCreator] = useState<Creator>({
    no: 0,
    loginId: "",
    nickname: "",
    content: "",
    modifier: 0,
    profile: "",
    background: "",
    totalBoardCount: 0,
    totalViewCount: 0,
    updatedAt: "",
    createdAt: "",
    deletedAt: "",
  });
  // 영상 결제시도 시 상태 관리
  const [selectedBoard, setSelectedBoard] = useState<board | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // 설명 상세보기 버튼 상태 관리
  const [isExpandedBio, setIsExpandedBio] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const quillRef = useRef<HTMLDivElement | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const { translate } = useTranslation();

  const handleCreatorClick = (creator: Creator): void => {
    navigate(`/user/${creator.no}`);
  };

  const fetchData = async () => {
    try {
      setLoadingState("loading");
      const [boardsResponse, creatorResponse, creatorsResponse] =
        await Promise.all([
          api.get(`/board/list?creatorNo=${creatorNo}`),
          api.get(`/creator?creatorNo=${creatorNo}`),
          api.get(`/creator/list`),
        ]);

      console.log(creatorResponse, creatorsResponse);

      setBoards(boardsResponse.data.data.list);
      setCreator(creatorResponse.data.data);
      setCreators(creatorsResponse.data.data.list);
      setLoadingState("success");
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingState("error");
      Toast(ToastType.error, "데이터를 불러오는데 실패했습니다.");
      navigate("/error", { state: 500 });
    }
  };

  useEffect(() => {
    fetchData();
  }, [creatorNo]);

  useEffect(() => {
    // creator.content가 변경될 때마다 content 높이 체크
    const checkContentHeight = () => {
      const quillEditor = quillRef.current?.querySelector(".ql-editor");
      if (quillEditor) {
        const contentHeight = quillEditor.scrollHeight;
        const MAX_HEIGHT = 72; // 4.8rem = 72px
        setShowExpandButton(contentHeight > MAX_HEIGHT);
      }
    };

    checkContentHeight();
  }, [creator.content]);

  const findCreator = (id: number) => {
    return creators.find((creator) => creator.no === id);
  };

  const handleBoardClick = (board: board) => {
    // 이미 결제 된 영상은 바로 재생
    if (board.paid || board.point === 0) {
      navigate(`/video/${board.boardNo}`);
    } else {
      // 유료 콘텐츠(영상)인 경우 결제 모달 표시
      setSelectedBoard(board);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentComplete = () => {
    if (selectedBoard) {
      navigate(`/video/${selectedBoard.boardNo}`);
    }
  };

  const filteredBoards = boards.filter((board) => {
    if (activeTab === "free") {
      return board.urls.image; // 이미지가 있는 게시글만 표시
    } else {
      return board.urls.thumbnail; // 썸네일(영상)이 있는 게시글만 표시
    }
  });

  const handleTranslateContent = async () => {
    if (!creator.content) return;

    setIsTranslating(true);
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

      console.log("번역 시도:", {
        text: creator.content,
        targetLang,
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      });

      const translated = await translate(creator.content, targetLang);
      console.log("번역 결과:", translated);

      // HTML 형식의 텍스트를 ReactQuill이 처리할 수 있는 형식으로 변환
      const formattedContent = translated
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">");
      setTranslatedContent(formattedContent);
      setIsTranslated(true);
    } catch (error) {
      console.error("번역 실패 상세:", error);
      Toast(ToastType.error, "번역에 실패했습니다.");
    } finally {
      setIsTranslating(false);
    }
  };

  if (loadingState === "loading") {
    return <Loading />;
  }

  if (loadingState === "error") {
    return (
      <MaintenanceContainer>
        <Settings size={48} className="spin" />
        <MaintenanceText>데이터 로딩에 실패했습니다.</MaintenanceText>
        <RetryButton onClick={fetchData}>다시 시도</RetryButton>
      </MaintenanceContainer>
    );
  }

  return (
    <>
      <UserTopSection>
        <ProfileBackground $image={creator.background}>
          <ProfilePicture src={creator.profile} alt={creator.nickname} />
        </ProfileBackground>
        <ProfileHeader>
          <Username>{creator.nickname}</Username>
          <Bio>@{creator.loginId}</Bio>
          <StyledQuillWrapper $isExpanded={isExpandedBio}>
            <div className="quill-container" ref={quillRef}>
              <ReactQuill
                value={translatedContent || creator.content}
                readOnly={true}
                theme="bubble"
                modules={{
                  toolbar: false,
                }}
              />
            </div>
            <TranslateButtonContainer>
              <Button
                variant="outlined"
                startIcon={<TranslateIcon />}
                onClick={handleTranslateContent}
                disabled={isTranslating || !creator.content}
                size="small"
              >
                {isTranslating
                  ? "번역 중..."
                  : isTranslated
                  ? "번역됨"
                  : "번역하기"}
              </Button>
            </TranslateButtonContainer>
            {showExpandButton && (
              <ExpandButton onClick={() => setIsExpandedBio(!isExpandedBio)}>
                {isExpandedBio ? "접기" : "더보기"}
              </ExpandButton>
            )}
          </StyledQuillWrapper>
        </ProfileHeader>
      </UserTopSection>

      <TabContainer>
        <TabButton
          active={activeTab === "free"}
          onClick={() => setActiveTab("free")}
        >
          무료
        </TabButton>
        <TabButton
          active={activeTab === "premium"}
          onClick={() => setActiveTab("premium")}
        >
          유료
        </TabButton>
      </TabContainer>

      {filteredBoards.length === 0 ? (
        <EmptyState
          message={`등록된 ${
            activeTab === "free" ? "사진" : "영상"
          }이 없습니다`}
        />
      ) : (
        <MovieMainContainer>
          <MovieList
            boards={filteredBoards}
            creators={creators}
            onCreatorClick={handleCreatorClick}
            onBoardClick={handleBoardClick}
            shouldBlur={activeTab === "premium"}
          />
        </MovieMainContainer>
      )}
      <SideContainer>{/* <RecommendedUploaders /> */}</SideContainer>
      {selectedBoard && (
        <PointUseModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBoard(null);
          }}
          board={selectedBoard}
          creator={findCreator(selectedBoard.creatorNo)!}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default User;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  /* padding: 0 2rem; */
  margin: 3rem 0;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem 2rem;
  margin-bottom: -1px;
  font-size: 1.6rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  color: ${(props) => (props.active ? "#7C3AED" : "#6B7280")};
  border-bottom: 2px solid ${(props) => (props.active ? "#7C3AED" : "#d6d6d6")};
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.active ? "#7C3AED" : "#374151")};
  }
`;

const MaintenanceContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ededed;
  color: white;
  gap: 2rem;

  .spin {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const MaintenanceText = styled.h2`
  font-size: 2.4rem;
  color: #ff627c;
`;

const RetryButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.6rem;
  background-color: transparent;
  border: 1px solid #eb3553;
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff627c;
    color: white;
  }
`;

const UserTopSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin: 7rem 0 1.5rem 0;
  padding: 2rem;
`;

const ProfileBackground = styled.div<{ $image: string }>`
  position: relative;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  height: 250px;
`;

const ProfilePicture = styled.img`
  position: absolute;
  bottom: -4.5rem;
  left: 2rem;
  width: 96px;
  height: 96px;

  border: 4px solid white;
  border-radius: 50%;
  margin-right: 1.5rem;
`;

const Username = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Bio = styled.p`
  font-size: 1.4rem;
  color: #666;
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

const MovieMainContainer = styled.div`
  margin-top: 2rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 900px) {
    padding-bottom: 10rem;
  }
`;

const SideContainer = styled.div`
  margin-right: 4rem;
  position: sticky; // sticky 포지셔닝 추가
  top: 0.1rem; // 상단에서 2rem 떨어진 위치에 고정
  height: fit-content; // 내용물 높이에 맞게 조정
  align-self: flex-start; // 플렉스 컨테이너의 상단에 정렬

  @media (max-width: 1150px) {
    display: none;
  }
`;

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

const TranslateButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
