// src/pages/User.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";
import { media } from "../types/media";
// import {SkeletonImage} from "../components/commons/media/Skeleton";
import { api } from "../utils/api";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/user";
import Toast from "../components/commons/Toast";
import { ToastType } from "../types/toast";
import { getCookie } from "../utils/cookie";
import { Settings } from "lucide-react";
import Loading from "../components/commons/Loading";
import EmptyState from "../components/commons/EmptyState";
// import searchIcon from "../assets/search.png";
import { Uploader } from "../types/user";

import MovieList from "../components/main/MovieList";
import { RecommendedUploaders } from "../components/main/RecommendList";
import ReactQuill from "react-quill";
// import SideBannder from "../assets/side-banner.png";

type LoadingState = "loading" | "error" | "success";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const id = useParams().id;
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
  const [uploader, setUploader] = useState<Uploader>({
    id: 0,
    user_id: "",
    username: "",
    description: "",
    profile_image: "",
    created_at: "",
    background_image: "",
    bloom: 0,
    media_count: 0,
    total_views: 0,
    last_upload: "",
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  console.log(showModal, selectedVideoId);

  const handleUploaderClick = (uploader: Uploader): void => {
    navigate(`/user/${uploader.id}`);
  };

  const fetchData = async () => {
    try {
      setLoadingState("loading");
      // Promise.all을 사용하여 병렬로 API 요청
      const [mediaResponse, uploaderResponse] = await Promise.all([
        api.get(`/media/recent?uploaderId=${id}limit=12`),
        api.get(`/uploaders?page=1&limit=10`),
      ]);

      setMedias(mediaResponse.data.data);
      setUploaders(uploaderResponse.data.data);
      // 업로더 단일조회 정보 저장

      const findUploaderIdx = (id: number) => {
        return uploaderResponse.data.data.filter((uploader: Uploader) => {
          return uploader.id === id;
        })[0];
      };
      setUploader(findUploaderIdx(Number(id)));

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

    const access = getCookie("accessToken");
    if (!access) {
      dispatch(logout());
      localStorage.removeItem("accessToken");
    }
  }, []);

  const handleMediaClick = (media: media) => {
    if (!user) {
      Toast(ToastType.error, "로그인 후에 접근 가능합니다.");
      return;
    }

    if (!isAdmin) {
      setSelectedVideoId(media.boardNo);
      setShowModal(true);
      return;
    }

    navigate(`/video/${media.boardNo}`);
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
      <UserContainer>
        <UserTopSection>
          <ProfileBackground $image={uploader.background_image}>
            <ProfilePicture
              src={uploader.profile_image}
              alt={uploader.username}
            />
          </ProfileBackground>
          <ProfileHeader>
            <Username>{uploader.username}</Username>
            <Bio>@{uploader.user_id}</Bio>
            <StyledQuillWrapper>
              <ReactQuill
                value={uploader.description}
                readOnly={true}
                theme="bubble"
                modules={{
                  toolbar: false,
                }}
              />
            </StyledQuillWrapper>
          </ProfileHeader>
        </UserTopSection>
        {medias.length === 0 ? (
          <EmptyState message={`등록된 영상이 없습니다`} />
        ) : (
          <MovieMainContainer>
            <MovieList
              medias={medias}
              uploaders={uploaders}
              onUploaderClick={handleUploaderClick}
              onMediaClick={handleMediaClick}
              shouldBlur={shouldBlur}
            />
          </MovieMainContainer>
        )}
      </UserContainer>
      <SideContainer>
        <RecommendedUploaders />
        {/* <img src={SideBannder} alt="광고 배너" /> */}
      </SideContainer>
    </MainContainer>
  );
};
export default User;

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
    display: block;
    padding-top: 0;
  }

  /* 웹킷 기반 브라우저용 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #eb3553;
    border-radius: 5px;

    /* 그라데이션 효과 추가 */
    background: linear-gradient(180deg, #eb3553 0%, #ff4d6a 100%);
  }

  /* 호버 시 색상 변경 */
  &::-webkit-scrollbar-thumb:hover {
    background: #d42e4a;
    background: linear-gradient(180deg, #d42e4a 0%, #eb3553 100%);
  }
`;

const UserContainer = styled.div`
  max-width: 750px;
  flex: 1;
  color: #000000;
  margin: 0 4rem;

  @media (max-width: 900px) {
    max-width: 900px;
    margin: 0;
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
