import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../utils/api";
import badgeIcon from "../assets/19_badge.png";
import { useNavigate } from "react-router-dom";

interface Creator {
  no: number;
  profile: string;
  nickname: string;
}

interface DataResponse {
  pagination: {
    cursor: string;
    size: number;
    hasNext: boolean;
  };
  list: Creator[];
}

interface ApiResponse {
  code: number;
  message: string;
  data: DataResponse;
}

const Creators: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleClickProfile = (no: number) => {
    navigate(`/user/${no}`);
  };

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/creator/list");
        const result: ApiResponse = await response.data;

        if (result.code === 0) {
          setCreators(result.data.list);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("크리에이터 정보를 불러오는데 실패했습니다.");
        console.error("크리에이터 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, []);

  if (isLoading) return <LoadingWrapper>로딩중...</LoadingWrapper>;
  if (error) return <ErrorWrapper>{error}</ErrorWrapper>;

  return (
    <Container>
      <CreatorTitle>크리에이터</CreatorTitle>
      <GridContainer>
        {creators.map((creator) => (
          <ImageCard
            key={creator.no}
            onClick={() => handleClickProfile(creator.no)}
          >
            <ProfileImage src={creator.profile} alt={creator.nickname} />
            <BadgeIcon src={badgeIcon} alt="19뱃지" />
          </ImageCard>
        ))}
      </GridContainer>
    </Container>
  );
};

export default Creators;

const Container = styled.section`
  max-width: 1200px;
  /* margin: 0 auto; */
`;

const CreatorTitle = styled.h2`
  font-size: 2.2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ImageCard = styled.div`
  cursor: pointer;
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 정사각형 비율 유지 */
  /* border-radius: 12px; */
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BadgeIcon = styled.img`
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 35px;
  height: 35px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ff4444;
  font-size: 16px;
`;
