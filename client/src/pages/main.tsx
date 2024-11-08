import styled from "styled-components";
import {useEffect, useState} from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {SvgIcon} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {media} from "../types/media";
import {SkeletonImage} from "../components/commons/media/Skeleton";
import {api} from "../utils/api";
import {RootState} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {getCookie} from "../utils/cookie";
import {logout, verifyAdult} from "../store/slices/user";
import AdultVerificationModal from "../components/commons/media/AdultVerificationModal";
import Toast from "../components/commons/Toast";
import {ToastType} from "../types/toast";

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.isLoggedIn);
  const isAdultVerified = useSelector(
    (state: RootState) => state.user.is_adult_verified
  );
  const isAdmin = useSelector((state: RootState) => state.user.is_admin);

  const [medias, setMedias] = useState<media[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchNewData = async () => {
      try {
        const response = await api.get(`/media/recent?limit=${4}`);
        setMedias(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // const fetchUploaderData = async () => {
    //   try {
    //     const response = await api.get(`/media/uploader`);
    //     console.log(response);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // const fetchWeeklyData = async () => {
    //   try {
    //     const response = await api.get(`/media/weekly/${}`);
    //     console.log(response);

    //     setMedias(response.data.data);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    fetchNewData();
    // fetchUploaderData();

    // 토큰이 만료됐을 때, 새로고침 시 유저 전역상태 업데이트
    const access = getCookie("accessToken");
    if (!access) {
      dispatch(logout());
      localStorage.removeItem("accessToken");
    }
  }, []);

  return (
    <MainContainer>
      <MovieContainer>
        <MovieTitle>최근에 등록된 동영상</MovieTitle>
        <hr />
        <MovieGrid>
          {medias.map((el) => {
            return (
              <MovieLi
                key={el.id}
                onClick={() => {
                  handleClickList(el.id);
                }}
              >
                {/* 비회원은 썸네일 가리기(lock_thumbnail), 회원은 el.thumbnail 보여주기 */}
                <ImgContainer>
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
                    <p>{el.views.toLocaleString()}</p>
                  </div>
                </MovieInfo>
                <MovieDescription>{el.title}</MovieDescription>
              </MovieLi>
            );
          })}
        </MovieGrid>
      </MovieContainer>
      {/* 성인인증 모달 */}
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

const MainContainer = styled.section`
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
`;

const MovieContainer = styled.div`
  width: 100%;
  height: 100%;
  color: white;
  margin: 0 4rem;
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
  margin: 0.5rem 0;
  font-size: 1.8rem;
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
`;
