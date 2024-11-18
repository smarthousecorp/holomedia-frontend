import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import {media} from "../types/media";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SvgIcon,
} from "@mui/material";
import MediaList from "../components/commons/media/MediaList";
import {api} from "../utils/api";
import {useSelector} from "react-redux";
import {RootState} from "../store";

interface PaymentStatus {
  message?: string;
  requirePayment: boolean;
  price: number;
}

const VideoDetail = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const videoRef = useRef(null);
  const user = useSelector((state: RootState) => state.user.isLoggedIn);
  console.log(user);

  const isAdmin = useSelector((state: RootState) => state.user.is_admin);

  const [media, setMedia] = useState<media>();
  const [recommended, setRecommended] = useState<media[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentStatus | null>(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const onClosePaymentDialog = () => {
    setShowPaymentDialog(false);
    setTimeout(() => {
      navigate({pathname: "/"});
    }, 0); // 상태 업데이트 후에 네비게이트
  };

  const handlePayment = async () => {
    try {
      await api.post(`/media/${id}/payment`, {
        amount: paymentInfo?.price,
      });
      setShowPaymentDialog(false);
      fetchMediaData(); // 결제 후 미디어 데이터 다시 불러오기
    } catch (error) {
      console.error("Payment failed:", error);
      alert("결제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const fetchMediaData = async () => {
    try {
      const response = await api.get(`/media/${id}`);

      if (!isAdmin && response.data.requirePayment) {
        setPaymentInfo(response.data);
        setShowPaymentDialog(true);
      } else {
        setMedia(response.data);
      }

      const recommendedResponse = await api.get(`/media/recommend`);

      setRecommended(recommendedResponse.data);
    } catch (error) {
      const {response} = error as any;
      if (!isAdmin && response?.data?.requirePayment) {
        setPaymentInfo(response.data);
        setShowPaymentDialog(true);
      }
    }
  };

  useEffect(() => {
    fetchMediaData();
  }, [id]);

  return (
    <VideoDetailContainer>
      <VideoPlayContainer>
        <VideoPlayer>
          {!showPaymentDialog && (
            <video
              ref={videoRef}
              src={media?.url}
              poster={media?.thumbnail}
              onPlay={handlePlay}
              className={isPlaying ? "playing" : ""}
              controls
            />
          )}
        </VideoPlayer>
        <VideoInformation>
          <NameAndView>
            <p>{media?.name}</p>
            <Views>
              <SvgIcon
                component={VisibilityIcon}
                sx={{stroke: "#ffffff", strokeWidth: 0.3}}
              />
              <p>{media?.views?.toLocaleString()}</p>
            </Views>
          </NameAndView>
          <Title>{media?.title}</Title>
        </VideoInformation>
      </VideoPlayContainer>
      <RcmndLists>
        {recommended.map((el) => (
          <MediaList key={el.id} media={el} />
        ))}
      </RcmndLists>

      {/* 결제 다이얼로그 */}
      <CustomDialog open={showPaymentDialog} onClose={onClosePaymentDialog}>
        <CustomDialogTitle>결제가 필요한 영상입니다</CustomDialogTitle>
        <CustomDialogContent>
          <p>이 영상을 시청하기 위해서는 결제가 필요합니다.</p>
          <p>가격: {paymentInfo?.price?.toLocaleString()}원</p>
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={onClosePaymentDialog}>취소</Button>
          <Button onClick={handlePayment} variant="contained" color="primary">
            결제하기
          </Button>
        </DialogActions>
      </CustomDialog>
    </VideoDetailContainer>
  );
};

export default VideoDetail;

// 기존 스타일 컴포넌트는 동일하게 유지
const VideoDetailContainer = styled.section`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  color: #fff;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
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

  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 4rem;
    padding-right: 3rem;
    padding-top: 5rem;
  }
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
    object-fit: cover;
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

// Dialog 커스텀

const CustomDialog = styled(Dialog)`
  font-family: "Pretendard-Medium";

  border: 1px solid black;
`;

const CustomDialogTitle = styled(DialogTitle)`
  font-family: "Pretendard-Bold" !important;
  font-size: 1.5rem !important;
`;

const CustomDialogContent = styled(DialogContent)`
  font-size: 1.35rem;

  & > p {
    margin-bottom: 0.5rem;
  }
`;
