import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import Hls from "hls.js";

interface WatermarkPosition {
  left: number;
  top: number;
}

interface WatermarkItemProps {
  left: number;
  top: number;
  opacity?: number;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  watermark?: {
    text?: string;
    image?: string;
    opacity?: number;
    spacing?: number; // 워터마크 간의 간격 (픽셀)
    rotation?: number; // 워터마크 회전 각도
  };
  onError?: (error: Error) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  watermark,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // 시간 이동 함수
  const handleTimeSkip = (
    direction: "forward" | "backward",
    seconds: number = 10
  ) => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const newTime =
      direction === "forward"
        ? Math.min(video.currentTime + seconds, video.duration)
        : Math.max(video.currentTime - seconds, 0);

    video.currentTime = newTime;
  };

  // 비디오 클릭 이벤트 처리 함수
  const handleVideoClick = (e: React.MouseEvent) => {
    // 컨트롤 영역 클릭 시 이벤트 무시
    if ((e.target as HTMLElement).closest(".controls-area")) return;
    togglePlay();
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // HLS 지원 확인 및 설정
    if (src.includes(".m3u8") || isHLSContent(src)) {
      console.log("지원 확인되었습니다.", src);

      // 브라우저 네이티브 HLS 지원 확인
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari의 경우 네이티브 HLS 지원
        video.src = src;
      } else if (Hls.isSupported()) {
        // hls.js를 통한 HLS 지원
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        // 에러 처리
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // 네트워크 에러 시 재시도
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                // 미디어 에러 시 복구 시도
                hls.recoverMediaError();
                break;
              default:
                // 복구 불가능한 에러
                hls.destroy();
                onError?.(new Error("HLS 스트리밍 에러"));
                break;
            }
          }
        });
      } else {
        onError?.(new Error("HLS가 지원되지 않는 브라우저입니다."));
      }
    } else {
      // 일반 비디오 소스
      video.src = src;
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src, onError]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 입력 필드에서 키 입력 시 이벤트 무시
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ": // 스페이스바
          e.preventDefault();
          togglePlay();
          break;
        case "j": // 뒤로 10초
          e.preventDefault();
          handleTimeSkip("backward", 10);
          break;
        case "l": // 앞으로 10초
          e.preventDefault();
          handleTimeSkip("forward", 10);
          break;
        case "arrowleft": // 뒤로 5초
          e.preventDefault();
          handleTimeSkip("backward", 5);
          break;
        case "arrowright": // 앞으로 5초
          e.preventDefault();
          handleTimeSkip("forward", 5);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying]); // isPlaying 상태가 변경될 때마다 이벤트 리스너 업데이트

  // 비디오 메타데이터 로드 시 재생 시간 업데이트
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (videoRef.current?.parentElement) {
        setContainerDimensions({
          width: videoRef.current.parentElement.offsetWidth,
          height: videoRef.current.parentElement.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // HLS 컨텐츠인지 확인하는 헬퍼 함수
  const isHLSContent = (url: string): boolean => {
    // .tmp 확장자이거나 다른 HLS 관련 패턴 확인
    return (
      url.includes(".tmp") ||
      url.includes("playlist") ||
      url.toLowerCase().includes("manifest")
    );
  };

  // 워터마크 배열 생성
  const getWatermarkPositions = (): WatermarkPosition[] => {
    const spacing = watermark?.spacing || 150;
    const positions: WatermarkPosition[] = [];

    // 컨테이너 대각선 길이를 계산하여 필요한 워터마크 수 계산
    const diagonal = Math.sqrt(
      Math.pow(containerDimensions.width, 2) +
        Math.pow(containerDimensions.height, 2)
    );

    const rows = Math.ceil(diagonal / spacing) + 1;
    const cols = Math.ceil(diagonal / spacing) + 1;

    for (let i = -1; i < rows; i++) {
      for (let j = -1; j < cols; j++) {
        positions.push({
          left: j * spacing,
          top: i * spacing,
        });
      }
    }

    return positions;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Container>
      <Video
        ref={videoRef}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onError={() => onError?.(new Error("Video playback error"))}
        onClick={handleVideoClick}
      />

      <WatermarkContainer rotation={watermark?.rotation}>
        {getWatermarkPositions().map((pos, index) => (
          <WatermarkItem
            key={index}
            left={pos.left}
            top={pos.top}
            opacity={watermark?.opacity}
          >
            {watermark?.image ? (
              <WatermarkImage src={watermark.image} alt="watermark" />
            ) : (
              <WatermarkText>
                {watermark?.text || "© Your Company"}
              </WatermarkText>
            )}
          </WatermarkItem>
        ))}
      </WatermarkContainer>

      <ControlsOverlay>
        <ControlsContainer>
          <ProgressBarContainer ref={progressRef} onClick={handleProgressClick}>
            <ProgressBar progress={progress} />
            <ProgressHandle progress={progress} />
          </ProgressBarContainer>

          <ControlsRow>
            <LeftControls>
              <PlayButton onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </PlayButton>

              <VolumeControlContainer>
                <ControlButton onClick={toggleMute}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </ControlButton>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </VolumeControlContainer>

              <TimeDisplay>
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>
            </LeftControls>

            <RightControls>
              <ControlButton>
                <Settings size={20} />
              </ControlButton>
              <ControlButton onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </ControlButton>
            </RightControls>
          </ControlsRow>
        </ControlsContainer>
      </ControlsOverlay>
    </Container>
  );
};

export default VideoPlayer;

const Container = styled.div`
  position: relative;
  width: 100%;
  background: black;
  overflow: hidden;

  @media (min-width: 901px) {
    aspect-ratio: 16 / 9;
    border-radius: 12px;
  }

  @media (max-width: 900px) {
    height: 100%;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;

  @media (min-width: 901px) {
    object-fit: contain;
  }

  @media (max-width: 900px) {
    object-fit: cover;
  }
`;
const ControlsOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 40%, rgba(0, 0, 0, 0.8));
  opacity: 0;
  transition: opacity 0.3s ease;

  ${Container}:hover & {
    opacity: 1;
  }
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border-radius: 2px;
  transition: height 0.2s ease;

  &:hover {
    height: 6px;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  width: ${(props) => props.progress}%;
  transition: width 0.1s linear;
`;

const ProgressHandle = styled.div<{ progress: number }>`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  top: 50%;
  left: ${(props) => props.progress}%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ProgressBarContainer}:hover & {
    opacity: 1;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PlayButton = styled(ControlButton)`
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const VolumeControlContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover input[type="range"] {
    width: 80px;
    opacity: 1;
  }
`;

const VolumeSlider = styled.input`
  width: 0;
  opacity: 0;
  transition: all 0.2s ease;
  appearance: none;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 14px;
  font-family: monospace;
  padding-left: 8px;
`;

const WatermarkContainer = styled.div<{ rotation?: number }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  transform: ${(props) => `rotate(${props.rotation || -30}deg)`};
`;

const WatermarkItem = styled.div<WatermarkItemProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  left: ${({ left }) => `${left}px`};
  top: ${({ top }) => `${top}px`};
  opacity: ${({ opacity }) => opacity || 0.3};
`;

const WatermarkText = styled.span`
  color: #a1a1a1;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const WatermarkImage = styled.img`
  max-width: 80px;
  max-height: 40px;
`;
