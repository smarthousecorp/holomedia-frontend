// VideoThumbnailSelector.tsx
import React, {useState, useEffect, useCallback, useRef} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import styled, {keyframes} from "styled-components";

interface VideoThumbnailSelectorProps {
  videoFile: File;
  onThumbnailSelect: (thumbnailUrl: string) => void;
  thumbnailCount?: number;
  quality?: number;
}

const VideoThumbnailSelector: React.FC<VideoThumbnailSelectorProps> = ({
  videoFile,
  onThumbnailSelect,
  thumbnailCount = 6,
  quality = 0.8,
}) => {
  const [thumbnails, setThumbnails] = useState<
    Array<{url: string; time: number}>
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blob URL 관리를 위한 ref 추가
  const blobUrlsRef = useRef<string[]>([]);
  const videoUrlRef = useRef<string | null>(null);

  const thumbnailsPerPage = 3;

  // video 및 canvas 요소를 ref로 관리
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 컴포넌트 마운트 시 한 번만 실행되는 초기화
  useEffect(() => {
    videoRef.current = document.createElement("video");
    videoRef.current.preload = "auto";

    canvasRef.current = document.createElement("canvas");
    canvasRef.current.width = 320;
    canvasRef.current.height = 180;

    ctxRef.current = canvasRef.current.getContext("2d");

    // 클린업 함수
    return () => {
      cleanupBlobUrls();
    };
  }, []);

  // Blob URL 정리 함수
  const cleanupBlobUrls = useCallback(() => {
    // 이전 비디오 URL 정리
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }

    // 이전 썸네일 URL들 정리
    blobUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    blobUrlsRef.current = [];
  }, []);

  // 썸네일 생성 함수
  const generateThumbnail = useCallback(
    async (
      video: HTMLVideoElement,
      time: number,
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      quality: number
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("썸네일 생성 시간 초과"));
        }, 5000);

        const onSeeked = () => {
          clearTimeout(timeoutId);
          try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(thumbnailUrl);
          } catch (err) {
            reject(
              new Error(err instanceof Error ? err.message : "썸네일 생성 실패")
            );
          }
        };

        video.addEventListener("seeked", onSeeked, {once: true});
        video.currentTime = time;
      });
    },
    []
  );
  // 비디오 파일이 변경될 때 썸네일 생성
  useEffect(() => {
    if (
      !videoFile ||
      !videoRef.current ||
      !canvasRef.current ||
      !ctxRef.current
    )
      return;

    const generateThumbnails = async () => {
      setIsLoading(true);
      setError(null);

      // 이전 Blob URL들 정리
      cleanupBlobUrls();

      // 새로운 비디오 URL 생성
      const videoUrl = URL.createObjectURL(videoFile);
      videoUrlRef.current = videoUrl;
      videoRef.current!.src = videoUrl;

      try {
        // 비디오 메타데이터 로딩 대기
        await new Promise<void>((resolve, reject) => {
          const onLoadedMetadata = () => resolve();
          const onError = (e: ErrorEvent) =>
            reject(new Error(`비디오 로딩 실패: ${e.message}`));

          videoRef.current!.addEventListener(
            "loadedmetadata",
            onLoadedMetadata,
            {once: true}
          );
          videoRef.current!.addEventListener("error", onError, {once: true});
        });

        const duration = videoRef.current!.duration;
        const interval = duration / (thumbnailCount - 1);
        const newThumbnails = [];

        for (let i = 0; i < thumbnailCount; i++) {
          const time = i * interval;
          const url = await generateThumbnail(
            videoRef.current!,
            time,
            canvasRef.current!,
            ctxRef.current!,
            quality
          );
          newThumbnails.push({url, time});
        }

        setThumbnails(newThumbnails);
        if (newThumbnails.length > 0) {
          onThumbnailSelect(newThumbnails[0].url);
        }
      } catch (err) {
        console.error("Error in thumbnail generation:", err);
        setError(
          err instanceof Error
            ? err.message
            : "썸네일 생성 중 오류가 발생했습니다"
        );
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnails();
  }, [
    videoFile,
    thumbnailCount,
    quality,
    generateThumbnail,
    cleanupBlobUrls,
    onThumbnailSelect,
  ]);

  const handleThumbnailClick = (index: number): void => {
    setSelectedIndex(index);
    onThumbnailSelect(thumbnails[index].url);
  };

  const handlePrevPage = (): void => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = (): void => {
    setCurrentPage((prev) =>
      Math.min(Math.ceil(thumbnails.length / thumbnailsPerPage) - 1, prev + 1)
    );
  };

  const visibleThumbnails = thumbnails.slice(
    currentPage * thumbnailsPerPage,
    (currentPage + 1) * thumbnailsPerPage
  );

  if (!videoFile) return null;

  return (
    <Container>
      {error && (
        <StyledAlert>
          <AlertIcon>⚠️</AlertIcon>
          <AlertContent>{error}</AlertContent>
        </StyledAlert>
      )}

      {isLoading ? (
        <LoadingWrapper>
          <Spinner />
          <LoadingText>썸네일 생성 중...</LoadingText>
        </LoadingWrapper>
      ) : thumbnails.length > 0 ? (
        <>
          <Description>썸네일을 선택해주세요</Description>

          <ThumbnailContainer>
            <NavigationButton
              direction="left"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              type="button"
            >
              <ChevronLeft size={24} />
            </NavigationButton>

            <ThumbnailGrid>
              {visibleThumbnails.map((thumbnail, idx) => {
                const absoluteIndex = currentPage * thumbnailsPerPage + idx;
                return (
                  <ThumbnailWrapper
                    key={idx}
                    isSelected={selectedIndex === absoluteIndex}
                    onClick={() => handleThumbnailClick(absoluteIndex)}
                  >
                    <ThumbnailImage
                      src={thumbnail.url}
                      alt={`썸네일 ${absoluteIndex + 1}`}
                    />
                    <TimeLabel>{Math.floor(thumbnail.time)}초</TimeLabel>
                  </ThumbnailWrapper>
                );
              })}
            </ThumbnailGrid>

            <NavigationButton
              direction="right"
              onClick={handleNextPage}
              disabled={
                currentPage >=
                Math.ceil(thumbnails.length / thumbnailsPerPage) - 1
              }
              type="button"
            >
              <ChevronRight size={24} />
            </NavigationButton>
          </ThumbnailContainer>
        </>
      ) : null}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Description = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;

const LoadingText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  border-top-color: #374151;
  animation: ${spin} 1s linear infinite;
`;

const StyledAlert = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  color: #991b1b;
`;

const AlertIcon = styled.span`
  margin-right: 0.75rem;
  flex-shrink: 0;
`;

const AlertContent = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ThumbnailContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0 2rem;
`;

const NavigationButton = styled.button<{
  direction: "left" | "right";
  disabled?: boolean;
}>`
  position: absolute;
  ${(props) => props.direction}: 0;
  z-index: 10;
  padding: 0.25rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 9999px;
  color: white;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

interface ThumbnailWrapperProps {
  isSelected: boolean;
}

const ThumbnailWrapper = styled.div<ThumbnailWrapperProps>`
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  ${(props) =>
    props.isSelected
      ? `
    box-shadow: 0 0 0 2px #3b82f6;
    transform: scale(1.05);
  `
      : `
    &:hover {
      box-shadow: 0 0 0 2px #60a5fa;
    }
  `}
`;

const ThumbnailImage = styled.img`
  width: 23rem;
  height: 13rem;
  object-fit: cover;
  border-radius: 0.25rem;

  @media (max-width: 768px) {
    width: 15rem;
    height: 8rem;
  }

  @media (max-width: 576px) {
    width: 8rem;
    height: 5rem;
  }
`;

const TimeLabel = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-top-left-radius: 0.25rem;
`;

export default React.memo(VideoThumbnailSelector);
