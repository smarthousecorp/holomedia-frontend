import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { board } from "../types/board";
import PointUseModal from "../components/commons/media/PointUseModal";
import { Creator } from "../types/user";

interface DataResponse {
  pagination: {
    cursor: string;
    size: number;
    hasNext: boolean;
  };
  list: board[];
}

interface CreatorDataResponse {
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

interface CreatorApiResponse {
  code: number;
  message: string;
  data: CreatorDataResponse;
}

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<board[]>([]);
  console.log(videos);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creators, setCreators] = useState<Creator[]>([]);

  // 영상 결제시도 시 상태 관리
  const [selectedBoard, setSelectedBoard] = useState<board | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const navigate = useNavigate();

  const handleClickVideo = (video: board) => {
    if (video.paid || video.point === 0) {
      navigate(`/video/${video.boardNo}`);
    } else {
      // 유료 콘텐츠(영상)인 경우 결제 모달 표시
      setSelectedBoard(video);
      setShowPaymentModal(true);
    }
  };

  const findCreator = (id: number) => {
    return creators.find((creator) => creator.no === id);
  };

  const handlePaymentComplete = () => {
    if (selectedBoard) {
      navigate(`/video/${selectedBoard.boardNo}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 영상 데이터 가져오기
        const videoResponse = await api.get("/board/list?size=10");
        const videoResult: ApiResponse = await videoResponse.data;

        // 크리에이터 데이터 가져오기
        const creatorResponse = await api.get("/creator/list?size=10");
        const creatorResult: CreatorApiResponse = await creatorResponse.data;

        if (videoResult.code === 0 && creatorResult.code === 0) {
          setVideos(videoResult.data.list);
          setCreators(creatorResult.data.list);
        } else {
          if (videoResult.code !== 0) {
            setError(videoResult.message);
          } else {
            setError(creatorResult.message);
          }
        }
      } catch (error) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("데이터 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <LoadingWrapper>로딩중...</LoadingWrapper>;
  if (error) return <ErrorWrapper>{error}</ErrorWrapper>;

  return (
    <>
      <Container>
        <VideoTitleH2>영상 목록</VideoTitleH2>
        <GridContainer>
          {videos.map((video) => {
            const creator = findCreator(video.creatorNo);
            return (
              <ImageCard
                key={video.boardNo}
                onClick={() => handleClickVideo(video)}
              >
                <ThumbnailImage src={video.urls.thumbnail} alt={video.title} />
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <CreatorId>
                    {creator ? creator.nickname : video.loginId}
                  </CreatorId>
                  <PointInfo>{video.point} 포인트</PointInfo>
                </VideoInfo>
              </ImageCard>
            );
          })}
        </GridContainer>
      </Container>
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

export default Videos;

const Container = styled.section`
  max-width: 1200px;
  /* margin: 0 auto; */
`;

const VideoTitleH2 = styled.h2`
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

const ThumbnailImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
`;

const VideoTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CreatorId = styled.p`
  font-size: 0.8rem;
  margin: 0 0 5px 0;
`;

const PointInfo = styled.p`
  font-size: 0.8rem;
  margin: 0;
  color: #ffcc00;
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
