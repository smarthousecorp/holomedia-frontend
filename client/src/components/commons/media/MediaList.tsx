import styled from "styled-components";
import {media} from "../../../types/media";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {SvgIcon} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {SkeletonImage} from "./Skeleton";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

// 영상 단일조회 페이지의 추천 리스트 컴포넌트
const MediaList = ({media}: {media: media}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.isLoggedIn);

  const handleClickList = (id: number) => {
    navigate(`/video/${id}`);
  };

  return (
    <MovieLi
      key={media.id}
      onClick={() => {
        handleClickList(media.id);
      }}
    >
      <ImgContainer>
        <SkeletonImage
          src={user ? media.member_thumbnail : media.non_thumbnail}
          alt="썸네일"
          background="#505050"
          objectFit="cover"
        />
      </ImgContainer>
      <div className="mo">
        <MovieInfo>
          <h6>{media.name}</h6>
          <div className="views">
            <SvgIcon
              component={VisibilityIcon}
              sx={{stroke: "#ffffff", strokeWidth: 0.3}}
            />
            <p>{media.views.toLocaleString()}</p>
          </div>
        </MovieInfo>
        <MovieDescription>{media.title}</MovieDescription>
      </div>
    </MovieLi>
  );
};

export default MediaList;

const MovieLi = styled.li`
  cursor: pointer;
  list-style: none; // 기본 리스트 스타일 제거
  border-radius: 10px;
  font-family: "Pretendard-Light";
  margin-bottom: 1.5rem;

  > img {
    width: 100%; // 가로 100%
    height: auto;
    object-fit: cover;
    border-radius: 10px; // 상단 모서리 둥글게
  }

  .mo {
    display: block;
    flex-direction: column-reverse;
    width: 100%;
    height: 100%;
    padding: 0 10px;
  }

  @media screen and (max-width: 768px) {
    display: flex;

    .mo {
      display: flex;
    }
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
    object-fit: cover; // 비율 유지하며 잘라내기
    border-radius: 10px; // 상단 모서리 둥글게
  }

  @media screen and (max-width: 768px) {
    width: 30%;
    padding-top: 20%;
  }
`;
