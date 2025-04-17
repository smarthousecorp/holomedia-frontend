import styled, { keyframes } from "styled-components";

export const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const SkeletonBase = styled.div<{ height?: string; width?: string }>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 2s infinite linear;
  border-radius: 12px;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
`;

// 비디오/크리에이터 카드용 스켈레톤
export const SkeletonCard = styled(SkeletonBase)`
  position: relative;
  padding-bottom: 100%;
`;
