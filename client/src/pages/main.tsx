// src/pages/Main.tsx
import {useEffect, useState} from "react";
import styled from "styled-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {SvgIcon} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {media, weeklyMedia} from "../types/media";
import {SkeletonImage} from "../components/commons/media/Skeleton";
import {api} from "../utils/api";
import {RootState} from "../store";
import {useSelector, useDispatch} from "react-redux";
import {logout, verifyAdult} from "../store/slices/user";
import AdultVerificationModal from "../components/commons/media/AdultVerificationModal";
import Toast from "../components/commons/Toast";
import {ToastType} from "../types/toast";
import {getCookie} from "../utils/cookie";
import {useTranslation} from "react-i18next";
import {getTimeAgo} from "../utils/getTimeAgo";
import {Settings} from "lucide-react";
import Loading from "../components/commons/Loading";

type LoadingState = "loading" | "error" | "success";

const Main = () => {
  const {t} = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.isLoggedIn);
  const isAdultVerified = useSelector(
    (state: RootState) => state.user.is_adult_verified
  );
  const isAdmin = useSelector((state: RootState) => state.user.is_admin);
  const {currentMode, currentUploader} = useSelector(
    (state: RootState) => state.view
  );
  const sectionTitle =
    currentMode === "weekly"
      ? t("sectionTitles.weekly", {uploader: currentUploader})
      : t(`sectionTitles.${currentMode}`);

  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  const [medias, setMedias] = useState<media[] | weeklyMedia[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoadingState("loading");
      let response;
      switch (currentMode) {
        case "new":
          response = await api.get(`/media/recent?limit=12`);
          break;
        case "best":
          response = await api.get("/media/best?limit=12");
          break;
        case "weekly":
          if (!currentUploader) return;
          response = await api.get(`/media/weekly/${currentUploader}`);
          break;
      }
      setMedias(response.data.data);
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
  }, [currentMode, currentUploader]);

  useEffect(() => {
    const access = getCookie("accessToken");
    if (!access) {
      dispatch(logout());
      localStorage.removeItem("accessToken");
    }
  }, []);

  const handleClickList = (id: number) => {
    if (!user) {
      Toast(ToastType.error, "로그인 후에 접근 가능합니다.");
      return;
    }

    if (!isAdmin && !isAdultVerified) {
      setSelectedVideoId(id);
      setShowModal(true);
      return;
    }

    navigate(`/video/${id}`);
  };

  // views를 표시하는 부분을 타입 가드를 사용하여 처리
  const getViews = (item: media | weeklyMedia): number => {
    if ("views" in item) {
      return item.views;
    }
    return item.total_views;
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
    <MainContainer>
      <MovieContainer>
        <MovieTitle>{sectionTitle}</MovieTitle>
        {/* <hr /> */}
        <MovieGrid>
          {medias.map((el) => (
            <MovieLi key={el.id} onClick={() => handleClickList(el.id)}>
              <ImgContainer>
                {el.price > 0 && (
                  <div className="price-badge">
                    {el.price.toLocaleString()}원
                  </div>
                )}
                <SkeletonImage
                  src={user ? el.member_thumbnail : el.non_thumbnail}
                  style={{objectFit: user ? "cover" : "contain"}}
                  alt="썸네일"
                  background="#505050"
                />
              </ImgContainer>
              <MovieInfo>
                <h6>{el.name}</h6>
                <div className="views">
                  <SvgIcon
                    component={VisibilityIcon}
                    sx={{stroke: "#ffffff", strokeWidth: 0.3}}
                  />
                  <p>{getViews(el).toLocaleString()}</p>
                </div>
              </MovieInfo>
              <MovieDescription>
                {el.title}
                <span className="timeAgo">
                  · {getTimeAgo(new Date(el.created_date))}
                </span>
              </MovieDescription>
            </MovieLi>
          ))}
        </MovieGrid>
      </MovieContainer>

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
  background: #000000;
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
  height: 100%;
  background: #000000;
`;

const MovieContainer = styled.div`
  /* width: 100%; */
  /* height: 100%; */
  color: white;
  margin: 0 4rem;
  margin-bottom: 3rem;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  > hr {
    margin: 10px 0;
    color: #ffffff;
    height: 1px;
  }

  @media (max-width: 600px) {
    margin: 0 2rem;
  }
`;

const MovieTitle = styled.h2`
  font-size: 2.2rem;
`;

const MovieGrid = styled.div`
  display: flex;
  flex-wrap: wrap; // 요소들이 줄 바꿈을 할 수 있도록 설정
  justify-content: flex-start;
  gap: 1rem; // 요소 간의 간격 설정
  margin-top: 2rem;

  @media (max-width: 600px) {
    justify-content: center; // 600px 이하에서 요소를 중앙 정렬
  }
`;

const MovieLi = styled.li`
  cursor: pointer;
  flex: 0 0 calc(25% - 1rem); // 기본적으로 4열로 설정, 여백을 고려하여 계산
  list-style: none; // 기본 리스트 스타일 제거
  border-radius: 10px;
  font-family: "Pretendard-Light";
  margin-bottom: 1.5rem;

  @media (max-width: 1200px) {
    flex: 0 0 calc(33.33% - 1rem); // 1200px 이하에서 3열
  }

  @media (max-width: 900px) {
    flex: 0 0 calc(50% - 1rem); // 900px 이하에서 2열
  }

  @media (max-width: 600px) {
    flex: 0 0 100%; // 600px 이하에서 1열
  }

  > img {
    width: 100%; // 가로 100%
    height: auto;
    object-fit: cover;
    border-radius: 10px; // 상단 모서리 둥글게
  }
`;

const MovieInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;

  > h6 {
    font-family: "Pretendard-Light";
    font-size: 1.4rem;

    @media (max-width: 600px) {
      font-size: 1.2rem; // 600px 이하에서 폰트 크기 조정
    }
  }

  .views {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;

    > svg {
      width: 1.6rem;
    }

    @media (max-width: 600px) {
      font-size: 1rem; // 600px 이하에서 폰트 크기 조정
    }
  }
`;

const MovieDescription = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0.5rem 0;
  font-size: 1.8rem;

  .timeAgo {
    font-size: 1.3rem;
  }
`;

const ImgContainer = styled.div`
  background-color: #505050;
  border-radius: 10px;
  width: 100%;
  height: 0; // 높이를 0으로 설정
  padding-top: 60%; // 비율을 유지하기 위해 패딩을 사용 (예: 4:3 비율)
  position: relative; // 자식 요소의 절대 위치를 설정하기 위해 relative로 설정
  overflow: hidden; // 넘치는 부분을 숨김

  > img {
    position: absolute; // 절대 위치로 설정
    top: 0;
    left: 0;
    width: 100%; // 가로 100%
    height: 100%; // 세로 100%
    object-fit: contain; // 비율 유지하며 잘라내기
    border-radius: 10px; // 상단 모서리 둥글게
  }

  // 가격 배지 스타일
  .price-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ff627c;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 1.4rem;
    z-index: 1;
    backdrop-filter: blur(4px);
  }
`;

// const NavUploaderName = styled.nav`
//   display: flex;
//   gap: 5px;
// `;

// const Uploader = styled.div<{$isSelected?: boolean}>`
//   font-size: 1.4rem;
//   padding: 0.5em 0.75rem;
//   cursor: pointer;
//   transition: all 0.2s ease;
//   border-radius: 5px;

//   /* 선택된 업로더 스타일 */
//   background-color: ${(props) => (props.$isSelected ? "#333" : "transparent")};

//   &:hover {
//     background-color: ${(props) => (props.$isSelected ? "#333" : "#222")};
//   }
// `;
