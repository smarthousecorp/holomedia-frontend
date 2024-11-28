// src/pages/Main.tsx
import {useEffect, useState} from "react";
import styled from "styled-components";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import {SvgIcon} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {media} from "../types/media";
// import {SkeletonImage} from "../components/commons/media/Skeleton";
import {api} from "../utils/api";
import {RootState} from "../store";
import {useSelector, useDispatch} from "react-redux";
import {logout, verifyAdult} from "../store/slices/user";
import AdultVerificationModal from "../components/commons/media/AdultVerificationModal";
import Toast from "../components/commons/Toast";
import {ToastType} from "../types/toast";
import {getCookie} from "../utils/cookie";
import {Settings} from "lucide-react";
import Loading from "../components/commons/Loading";
// import EmptyState from "../components/commons/EmptyState";
// import searchIcon from "../assets/search.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {Uploader} from "../types/user";
import UploaderList from "../components/main/UploaderList";
import ScoreProgress from "../components/main/ScoreProgress";
import MovieList from "../components/main/MovieList";
import {RecommendedUploaders} from "../components/main/RecommendList";
// import SideBannder from "../assets/side-banner.png";

type LoadingState = "loading" | "error" | "success";

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.isLoggedIn);
  const isAdultVerified = useSelector(
    (state: RootState) => state.user.is_adult_verified
  );
  const isAdmin = useSelector((state: RootState) => state.user.is_admin);

  const shouldBlur = !isAdmin && (!user || !isAdultVerified);

  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  // api 응답 저장 상태
  const [medias, setMedias] = useState<media[]>([]);
  const [uploaders, setUploaders] = useState<Uploader[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const handleUploaderClick = (uploader: Uploader): void => {
    navigate(`/user/${uploader.id}`);
  };

  const handleMediaClick = (media: media): void => {
    navigate(`/main/${media.id}`);
  };

  const fetchData = async () => {
    try {
      setLoadingState("loading");
      // Promise.all을 사용하여 병렬로 API 요청
      const [mediaResponse, uploaderResponse] = await Promise.all([
        api.get(`/media/recent?limit=12`),
        api.get(`/uploaders?page=1&limit=10`),
      ]);

      setMedias(mediaResponse.data.data);
      setUploaders(uploaderResponse.data.data);
      setLoadingState("success");
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingState("error");
      Toast(ToastType.error, "데이터를 불러오는데 실패했습니다.");
      navigate("/error", {state: 500});
    }
  };

  useEffect(() => {
    fetchData();

    const access = getCookie("accessToken");
    if (!access) {
      dispatch(logout());
      localStorage.removeItem("accessToken");
    }
  }, []);

  // const handleClickList = (id: number) => {
  //   if (!user) {
  //     Toast(ToastType.error, "로그인 후에 접근 가능합니다.");
  //     return;
  //   }

  //   if (!isAdmin && !isAdultVerified) {
  //     setSelectedVideoId(id);
  //     setShowModal(true);
  //     return;
  //   }

  //   navigate(`/video/${id}`);
  // };

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
    <MainContainer>
      <MovieContainer>
        <MovieTopSection>
          <MovieTitle>홈</MovieTitle>
          <InputWrapper>
            <SearchContainer placeholder="아이돌 찾기" />
            <SvgIcon
              className="searchIcon"
              component={SearchOutlinedIcon}
              // sx={{stroke: "#6d46cc", strokeWidth: 1}}
            />
          </InputWrapper>
        </MovieTopSection>
        {/* <hr /> */}
        {medias.length === 0 ? (
          // <EmptyState message={`홈에 등록된 영상이 없습니다`} />
          <></>
        ) : (
          <MovieMainContainer>
            <UploaderList
              uploaders={uploaders}
              onUploaderClick={handleUploaderClick}
            />
            <ScoreProgress currentScore={10} />
            <MovieList
              medias={medias}
              uploaders={uploaders}
              onUploaderClick={handleUploaderClick}
              onMediaClick={handleMediaClick}
              shouldBlur={shouldBlur}
            />
          </MovieMainContainer>
        )}
      </MovieContainer>
      <SideContainer>
        <RecommendedUploaders />
        {/* <img src={SideBannder} alt="광고 배너" /> */}
      </SideContainer>

      {showModal && (
        <AdultVerificationModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedVideoId(null);
          }}
          onComplete={() => {
            setShowModal(false);
            dispatch(verifyAdult());
            if (selectedVideoId) {
              navigate(`/video/${selectedVideoId}`);
              setSelectedVideoId(null);
            }
          }}
        />
      )}
    </MainContainer>
  );
};
export default Main;

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
  border: 1px solid #ff627c;
  color: #ff627c;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff627c;
    color: white;
  }
`;

const MainContainer = styled.section`
  width: 100%;
  height: 100vh; // 뷰포트 전체 높이로 변경
  background: #ededed;
  color: #000000;
  padding-top: 2rem;
  display: flex;
  overflow-y: auto; // 전체 컨테이너에 스크롤 추가

  @media (max-width: 900px) {
    overflow-y: visible;
  }
`;

const MovieContainer = styled.div`
  max-width: 750px;
  color: #000000;
  margin: 0 4rem;

  @media (max-width: 600px) {
    margin: 0 2rem;
  }
`;

const MovieTopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

const MovieTitle = styled.h2`
  font-size: 2.2rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .searchIcon {
    position: absolute;
    right: 1rem;
    font-size: 2.6rem;
    color: #eb3553;
    cursor: pointer;
    /* pointer-events: none; // 입력에 방해되지 않도록 */
  }
`;

const SearchContainer = styled.input`
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 1.2rem 1.5rem;
  padding-right: 2.5rem; // 아이콘을 위한 여백
  width: 22rem;
  font-size: 1.2rem;

  &::placeholder {
    color: #c7c7c7; // 원하는 색상으로 변경
  }
`;

const MovieMainContainer = styled.div`
  margin-top: 2rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 900px) {
    padding-bottom: 7rem;
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
