import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import {media} from "../types/media";
import ReactPlayer from "react-player";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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

  const isAdmin = useSelector((state: RootState) => state.user.is_admin);

  const [media, setMedia] = useState<media>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);

  const [paymentInfo, setPaymentInfo] = useState<PaymentStatus | null>(null);
  const [played, setPlayed] = useState<number>(0);
  console.log(played);

  // 초기 볼륨을 0.8로 설정
  const [volume, setVolume] = useState<number>(0.8);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleProgress = (state: {played: number}) => {
    setPlayed(state.played);
  };

  // 볼륨 변경 핸들러 수정
  const handleVolumeChange = (event: any) => {
    // 유효한 볼륨 값인지 확인하고 적용
    const newVolume = parseFloat(event?.target?.value || event);
    if (
      !isNaN(newVolume) &&
      isFinite(newVolume) &&
      newVolume >= 0 &&
      newVolume <= 1
    ) {
      setVolume(newVolume);
    }
  };

  const onClosePaymentDialog = () => {
    setShowPaymentDialog(false);
    setTimeout(() => {
      navigate({pathname: "/"});
    }, 0);
  };

  const handlePayment = async () => {
    try {
      await api.post(`/media/${id}/payment`, {
        amount: paymentInfo?.price,
      });
      setShowPaymentDialog(false);
      fetchMediaData();
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
          {!showPaymentDialog && media?.url && (
            <ReactPlayer
              url={media.url}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls={true}
              light={media.thumbnail}
              pip={false}
              stopOnUnmount={true}
              volume={volume}
              onPlay={handlePlay}
              onPause={handlePause}
              onProgress={handleProgress}
              onVolumeChange={handleVolumeChange}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                    disablePictureInPicture: false,
                  },
                },
              }}
              style={{
                objectFit: "contain",
                background: "#000",
              }}
            />
          )}
        </VideoPlayer>
      </VideoPlayContainer>

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

const VideoDetailContainer = styled.section`
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;

  @media (max-width: 900px) {
    height: calc(100vh - 13.5rem); // 헤더(7rem) + 푸터(6.5rem)
  }
`;

const VideoPlayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 901px) {
    max-width: 540px;
    margin: 0 auto;
  }
`;

const VideoPlayer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
