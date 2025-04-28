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
import { useTranslation } from "react-i18next";

import VideoPlayer from "../components/commons/media/VideoPlayer";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import HomeIcon from "@mui/icons-material/Home";

interface PaymentStatus {
  message?: string;
  requirePayment: boolean;
  price: number;
}

const VideoDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const id = useParams().id;

  // const isAdmin = useSelector((state: RootState) => state.user.is_admin);
  const isAdmin = false;
  const memberNo = useSelector((state: RootState) => state.user.memberNo);

  const [media, setMedia] = useState<board>();
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);

  const [paymentInfo, setPaymentInfo] = useState<PaymentStatus | null>(null);

  // ESC 키 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        handleGoBack();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // 뒤로가기 처리
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

  const handleHomeClick = () => {
    navigate("/main");
  };

  return (
    <VideoDetailContainer>
      {/* 모바일 뒤로가기 버튼 */}
      <BackButtonContainer>
        <IconButton
          onClick={handleGoBack}
          sx={{
            color: "white",
            padding: "12px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: "2.4rem" }} />
        </IconButton>
      </BackButtonContainer>

      {/* PC 뒤로가기 인디케이터 */}
      <PCNavigationHint>{t("videoDetail.navigation.pcHint")}</PCNavigationHint>

      {/* 새로운 컨트롤 바 추가 */}
      <ControlBar>
        <ControlButton onClick={handleGoBack}>
          <ArrowBackIcon sx={{ fontSize: "2rem" }} />
          <ButtonLabel>{t("videoDetail.navigation.back")}</ButtonLabel>
        </ControlButton>
        <ControlButton onClick={handleHomeClick}>
          <HomeIcon sx={{ fontSize: "2rem" }} />
          <ButtonLabel>{t("videoDetail.navigation.home")}</ButtonLabel>
        </ControlButton>
      </ControlBar>

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
        <CustomDialogTitle>{t("videoDetail.payment.title")}</CustomDialogTitle>
        <CustomDialogContent>
          <p>{t("videoDetail.payment.description")}</p>
          <p>
            {t("videoDetail.payment.price", {
              price: paymentInfo?.price?.toLocaleString(),
            })}
          </p>
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
            {t("videoDetail.payment.back")}
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
  position: relative;

  @media (max-width: 900px) {
    height: 100vh;
  }
`;

const BackButtonContainer = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;

  @media (max-width: 900px) {
    display: block;
    opacity: 1;
  }

  @media (min-width: 901px) {
    display: block;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }
`;

const VideoPlayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (min-width: 901px) {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
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

const PCNavigationHint = styled.div`
  display: none;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.8rem 1.6rem;
  border-radius: 2rem;
  font-size: 1.4rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1000;

  @media (min-width: 901px) {
    display: block;
    animation: fadeInOut 5s forwards;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  &:hover {
    opacity: 1;
    animation: none;
  }

  ${VideoPlayContainer}:hover & {
    opacity: 1;
    animation: none;
  }
`;

const ControlBar = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  display: flex;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 2rem;
  border-radius: 0 0 1.5rem 1.5rem;
  transition: transform 0.3s ease;
  z-index: 1000;

  @media (min-width: 901px) {
    &:hover {
      transform: translateX(-50%) translateY(0);
    }

    ${VideoDetailContainer}:hover & {
      transform: translateX(-50%) translateY(0);
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const ControlButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(2px);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const ButtonLabel = styled.span`
  font-size: 1.2rem;
  color: white;
  opacity: 0.8;
  font-weight: 500;
  margin-top: 0.2rem;
`;
