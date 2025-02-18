import { useEffect, useState } from "react";
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
    createdAt: "",
    profile: "",
    background: "",
  });
  // 영상 결제시도 시 상태 관리
  const [selectedBoard, setSelectedBoard] = useState<board | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

      setBoards(boardsResponse.data.data);
      setCreator(creatorResponse.data.data);
      setCreators(creatorsResponse.data.data);
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

  const findCreator = (id: number) => {
    return creators.find((creator) => creator.no === id);
  };

  const handleBoardClick = (board: board) => {
    // 이미 결제 된 영상은 바로 재생
    if (board.paid) {
      console.log("이미 결제 된 영상");

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
          <StyledQuillWrapper>
            <ReactQuill
              value={creator.content}
              readOnly={true}
              theme="bubble"
              modules={{
                toolbar: false,
              }}
            />
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

const StyledQuillWrapper = styled.div`
  margin-top: 2rem;

  .ql-container {
    font-family: inherit;
  }

  .ql-editor {
    padding: 0;
    font-size: 1.2rem;
    line-height: 1.4;
    color: #000000;

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
