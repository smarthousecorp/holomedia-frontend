import styled from "styled-components";
import axios from "axios";
import {useEffect, useState} from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {SvgIcon} from "@mui/material";

interface mediaType {
  id: number;
  title: string;
  url: string;
  views: number;
  thumbnail: string;
  name: string;
}

const Main = () => {
  const [medias, setMedias] = useState<mediaType[]>([]);

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
        <MovieTitle>인기 순위</MovieTitle>
        <MovieGrid>
          {medias.map((el) => {
            return (
              <MovieLi key={el.id}>
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

const MovieGrid = styled.ul`
  display: grid;
  row-gap: 2rem;
  column-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr); // 1200px 이하에서 3열
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr); // 900px 이하에서 2열
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr; // 600px 이하에서 1열
  }
`;

const MovieLi = styled.li`
  border-radius: 10px;
  width: 100%;
  font-family: "Pretendard-Light";

  > img {
    width: 100%;
    height: auto; // 비율 유지
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
  }

  .views {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;

    > svg {
      width: 1.6rem;
    }
  }
`;

const MovieDescription = styled.p`
  margin: 0.5rem 0;
  font-size: 1.8rem;
`;
