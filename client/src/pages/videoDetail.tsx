import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import {media} from "../types/media";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {SvgIcon} from "@mui/material";
import MediaList from "../components/commons/media/MediaList";

const VideoDetail = () => {
  const id = useParams().id;
  const videoRef = useRef(null);

  // 단일 영상 데이터
  const [media, setMedia] = useState<media>();
  // 추천 영상 데이터
  const [recommended, setRecommended] = useState<media[]>([]);

  // 영상 재생 상태
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  // 추후에 정지, 재생 시 유튜브처럼 아이콘을 띄울지 고민
  // const handlePause = () => {
  //   setIsPlaying(false);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_DOMAIN}/media/${id}`
        );
        setMedia(response.data);

        // 추천 리스트 데이터 가져오기 (예시로 같은 API에서 가져온다고 가정)
        const recommendedResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_DOMAIN}/media/recommend`
        );
        setRecommended(recommendedResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  return (
    <VideoDetailContainer>
      <VideoPlayContainer>
        <VideoPlayer>
          <video
            ref={videoRef}
            src="https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07"
            poster={media?.non_thumbnail}
            onPlay={handlePlay}
            // onPause={handlePause}
            className={isPlaying ? "playing" : ""}
            controls
          />
        </VideoPlayer>
        <VideoInformation>
          <NameAndView>
            <p>{media?.name}</p>
            <Views>
              <SvgIcon
                component={VisibilityIcon}
                sx={{stroke: "#ffffff", strokeWidth: 0.3}}
              />
              <p>{media?.views.toLocaleString()}</p>
            </Views>
          </NameAndView>
          <Title>{media?.title}</Title>
        </VideoInformation>
      </VideoPlayContainer>
      <RcmndLists>
        {recommended.map((el) => {
          return <MediaList key={el.id} media={el} />;
        })}
      </RcmndLists>
    </VideoDetailContainer>
  );
};

export default VideoDetail;

const VideoDetailContainer = styled.section`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  color: #fff;
`;

const VideoPlayContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  padding-left: 4rem;
  padding-top: 2rem;
  padding-right: 3rem;
  display: flex;
  flex-direction: column;
`;

const RcmndLists = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 380px;
  padding-top: 2rem;
  padding-right: 2rem;
`;

const VideoPlayer = styled.div`
  margin-bottom: 1rem;
  background-color: #505050;
  border-radius: 10px;
  width: 100%;
  height: 0; // 높이를 0으로 설정
  padding-top: 60%; // 비율을 유지하기 위해 패딩을 사용 (예: 4:3 비율)
  position: relative; // 자식 요소의 절대 위치를 설정하기 위해 relative로 설정
  overflow: hidden; // 넘치는 부분을 숨김

  > video[poster] {
    object-fit: contain;
  }

  > video {
    position: absolute; // 절대 위치로 설정
    top: 0;
    left: 0;
    width: 100%; // 가로 100%
    height: 100%; // 세로 100%
    object-fit: cover; // 비율 유지하며 잘라내기
    border-radius: 10px; // 상단 모서리 둥글게
  }

  > video.playing {
    object-fit: cover; // 비디오가 재생 중일 때는 cover로 설정
  }
`;

const VideoInformation = styled.div``;

const NameAndView = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > p {
    font-size: 1.6rem;
  }
`;

const Title = styled.h3`
  margin-top: 1rem;
  font-size: 2rem;
`;

const Views = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;

  > svg {
    font-size: 2rem;
  }

  > p {
    font-size: 1.4rem;
  }
`;
