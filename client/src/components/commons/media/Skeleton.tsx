import React, {ReactElement, useState} from "react";
import styled, {keyframes} from "styled-components";

interface SkeletonImageProps {
  src: string | undefined | null;
  alt: string;
  background?: string;
  imgStyle?: React.CSSProperties;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  [key: string]: any;
}

const StyledImage = styled.img<{loading: string}>`
  display: ${({loading}) => loading} !important;
`;

export function SkeletonImage({
  src,
  alt,
  background = "#F5F5F5",
  imgStyle,
  onLoad,
  ...props
}: SkeletonImageProps): ReactElement {
  const [isLoading, setIsLoading] = useState(true);

  // 1. API Fetch 가 아직 완료 되지 않아서 src 가 없는 경우
  if (!src) {
    return (
      <SkeletonContainer $background={background} style={imgStyle} {...props}>
        <div className="animationBar" />
      </SkeletonContainer>
    );
  }

  return (
    <>
      {/* 2. src 는 있지만 image 로드가 완료 되지 않은 경우 */}
      {isLoading && (
        <SkeletonContainer $background={background} style={imgStyle} {...props}>
          <div className="animationBar" />
        </SkeletonContainer>
      )}
      {/* 3. 이미지 로드가 완료된 경우 */}
      <StyledImage
        src={src}
        alt={alt}
        loading={isLoading ? "none" : "block"}
        onLoad={(e) => {
          if (onLoad) onLoad(e);
          setIsLoading(false);
        }}
        style={imgStyle}
        {...props}
      />
    </>
  );
}

const loadingAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50%,
  100% {
    transform: translateX(100%);
  }
`;

const SkeletonContainer = styled.div<{$background: string}>`
  background-color: ${({$background}) => $background};
  width: 100%;
  height: 100%;
  position: relative;

  .animationBar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      ${({$background}) => $background} 0%,
      rgba(255, 255, 255, 0.69) 30%,
      ${({$background}) => $background} 60%
    );
    animation: ${loadingAnimation} 1.5s infinite linear;
  }
`;
