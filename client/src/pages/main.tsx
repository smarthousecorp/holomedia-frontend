import styled from "styled-components";
import axios from "axios";
import {useEffect, useState} from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {SvgIcon} from "@mui/material";
import {useNavigate} from "react-router-dom";
interface mediaType {
  id: number;
  title: string;
  url: string;
  views: number;
  thumbnail: string;
  name: string;
}

const Main = () => {
  const navigate = useNavigate();

  const [medias, setMedias] = useState<mediaType[]>([]);

  const handleClickList = (id: number) => {
    navigate(`/video/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_DOMAIN}/media`
        );
        setMedias(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <MainContainer>
      <MovieContainer>
        <MovieTitle>NEW</MovieTitle>
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
                <img src="src/assets/lock_thumbnail.png" alt="썸네일" />
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
`;

const MovieTitle = styled.h2`
  font-size: 2.4rem;
`;

const MovieGrid = styled.div`
  display: flex;
  flex-wrap: wrap; // 요소들이 줄 바꿈을 할 수 있도록 설정
  justify-content: flex-start;
  gap: 1rem; // 요소 간의 간격 설정
  margin-top: 2rem;

  @media (max-width: 1200px) {
    justify-content: space-between; // 1200px 이하에서 요소 간의 간격 조정
  }

  @media (max-width: 900px) {
    justify-content: space-around; // 900px 이하에서 요소 간의 간격 조정
  }

  @media (max-width: 600px) {
    justify-content: center; // 600px 이하에서 요소를 중앙 정렬
  }
`;

const MovieLi = styled.li`
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
