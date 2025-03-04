import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { board } from "../types/board";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { api } from "../utils/api";

import VideoPlayer from "../components/commons/media/VideoPlayer";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface PaymentStatus {
  message?: string;
  requirePayment: boolean;
  price: number;
}

const VideoDetail = () => {
  const navigate = useNavigate();
  const id = useParams().id;

  // const isAdmin = useSelector((state: RootState) => state.user.is_admin);
  const isAdmin = false;
  const memberNo = useSelector((state: RootState) => state.user.memberNo);

  const [media, setMedia] = useState<board>();
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);

  const [paymentInfo, setPaymentInfo] = useState<PaymentStatus | null>(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const onClosePaymentDialog = () => {
    setShowPaymentDialog(false);
    setTimeout(() => {
      navigate({ pathname: "/main" });
    }, 0);
  };

  // const handlePayment = async () => {
  //   try {
  //     await api.post(`/media/${id}/payment`, {
  //       amount: paymentInfo?.price,
  //     });
  //     setShowPaymentDialog(false);
  //     fetchMediaData();
  //   } catch (error) {
  //     console.error("Payment failed:", error);
  //     alert("결제에 실패했습니다. 다시 시도해주세요.");
  //   }
  // };

  const fetchMediaData = async () => {
    try {
      const response = await api.get(`/board?boardNo=${id}`);
      setMedia(response.data.data);
    } catch (error) {
      const { response } = error as any;
      if (!isAdmin && response?.data?.requirePayment) {
        setPaymentInfo(response.data);
        setShowPaymentDialog(true);
      }
    }
  };

  const fetchViewCount = async () => {
    try {
      if (!media?.boardNo) return; // boardNo가 없으면 실행하지 않음

      const viewedBoards = JSON.parse(
        localStorage.getItem("viewedBoards") || "[]"
      );

      if (!viewedBoards.includes(media?.boardNo)) {
        await api.post(`/board/view`, {
          boardNo: media?.boardNo,
          memberNo: memberNo,
          creatorNo: media?.creatorNo,
        });

        viewedBoards.push(media?.boardNo);

        // 50개까지만 저장 (오래된 기록 삭제)
        if (viewedBoards.length > 50) {
          viewedBoards.shift();
        }

        localStorage.setItem("viewedBoards", JSON.stringify(viewedBoards));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMediaData();
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (media?.boardNo) {
      fetchViewCount();
    }
  }, [media]);

  return (
    <VideoDetailContainer>
      <BackButtonContainer>
        <IconButton
          onClick={handleGoBack}
          sx={{
            color: "white",
            padding: "12px", // 버튼 패딩 증가
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", // 호버 효과
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: "2.4rem" }} />
        </IconButton>
      </BackButtonContainer>
      <VideoPlayContainer>
        <VideoPlayerDiv>
          {!showPaymentDialog && media?.urls.video && (
            <VideoPlayer
              src={media.urls.video}
              poster={media.urls.thumbnail}
              watermark={{
                text: "192.168.0.1",
                opacity: 0.1,
                spacing: 200,
                rotation: -45,
              }}
            />
          )}
        </VideoPlayerDiv>
      </VideoPlayContainer>

      <CustomDialog open={showPaymentDialog} onClose={onClosePaymentDialog}>
        <CustomDialogTitle>결제가 필요한 영상입니다</CustomDialogTitle>
        <CustomDialogContent>
          <p>이 영상을 시청하기 위해서는 결제가 필요합니다.</p>
          <p>가격: {paymentInfo?.price?.toLocaleString()}원</p>
        </CustomDialogContent>
        <DialogActions>
          {/* <Button onClick={onClosePaymentDialog}>취소</Button>
          <Button onClick={handlePayment} variant="contained" color="primary">
            결제하기
          </Button> */}
          <Button
            onClick={onClosePaymentDialog}
            variant="contained"
            color="primary"
          >
            돌아가기
          </Button>
        </DialogActions>
      </CustomDialog>
    </VideoDetailContainer>
  );
};

export default VideoDetail;

const VideoDetailContainer = styled.section`
  width: 100%;
  height: 100vh;
  background-color: #000;
  overflow: hidden;

  @media (min-width: 901px) {
    min-height: calc(100vh - 13.5rem); // 헤더(7rem) + 푸터(6.5rem)
    padding: 2rem;
  }

  @media (max-width: 900px) {
    height: 100vh;
  }
`;

const BackButtonContainer = styled.div`
  display: none;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;

  @media (max-width: 900px) {
    display: block;
  }
`;

const VideoPlayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 901px) {
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 900px) {
    height: 100vh;
  }
`;

const VideoPlayerDiv = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;

  @media (max-width: 900px) {
    height: 100vh;
  }
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
