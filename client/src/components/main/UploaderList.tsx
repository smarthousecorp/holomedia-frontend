import React, {useRef, useState, useEffect} from "react";
import styled from "styled-components";
import {Uploader} from "../../types/user";

interface UploaderListProps {
  uploaders: Uploader[];
  onUploaderClick?: (uploader: Uploader) => void;
}

interface ProfileImageProps {
  $imageUrl?: string | null;
}

const UploaderList: React.FC<UploaderListProps> = ({
  uploaders,
  onUploaderClick,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 25;
      checkScrollable();
      updateScrollProgress();
    }
  }, [uploaders]);

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const {scrollWidth, clientWidth} = scrollContainerRef.current;
      setIsScrollable(scrollWidth > clientWidth);
    }
  };

  const updateScrollProgress = () => {
    if (scrollContainerRef.current) {
      const {scrollLeft, scrollWidth, clientWidth} = scrollContainerRef.current;
      const scrollableWidth = scrollWidth - clientWidth;
      const progress = (scrollLeft / scrollableWidth) * 100;
      setScrollProgress(progress);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
      updateScrollProgress();
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLUListElement>) => {
    e.preventDefault();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
      updateScrollProgress();
    }
  };

  const handleScroll = () => {
    updateScrollProgress();
  };

  const handleUploaderClick = (uploader: Uploader): void => {
    if (!isDragging && onUploaderClick) {
      onUploaderClick(uploader);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      const {left, width} = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - left) / width;
      const scrollableWidth =
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth;

      scrollContainerRef.current.scrollLeft = scrollableWidth * clickPosition;
      updateScrollProgress();
    }
  };

  return (
    <Container>
      <UploaderLists
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        onScroll={handleScroll}
        $isDragging={isDragging}
      >
        {uploaders.map((uploader) => (
          <UploaderItem
            key={uploader.id}
            onClick={() => handleUploaderClick(uploader)}
            $isDragging={isDragging}
          >
            <ProfileImage $imageUrl={uploader.profile_image} />
            <Username>{uploader.username}</Username>
          </UploaderItem>
        ))}
      </UploaderLists>
      {isScrollable && (
        <ProgressBarContainer onClick={handleProgressBarClick}>
          <ProgressBar $progress={scrollProgress} />
        </ProgressBarContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  max-width: 100%;
`;

const UploaderLists = styled.ul<{$isDragging: boolean}>`
  width: 100%;
  display: grid;
  justify-content: space-around;
  grid-auto-flow: column;
  grid-auto-columns: 8.5rem;
  padding: 0 0 1rem 0;
  border-radius: 0 0 17px 17px;
  background-color: #ffffff;
  overflow-x: auto;
  list-style: none;
  scroll-behavior: ${(props) => (props.$isDragging ? "auto" : "smooth")};
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "grab")};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 900px) {
    width: min(100%, calc(8.5rem * 7 + 1.2rem * 6 + 10rem));
    margin: 0 auto;
    border-radius: 17px;
    padding: 1rem 4rem;
    gap: 1.2rem;
  }
`;

const UploaderItem = styled.li<{$isDragging: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "pointer")};
  width: 8.5rem;
  transition: ${(props) =>
    props.$isDragging ? "none" : "transform 0.2s ease"};

  &:hover {
    transform: ${(props) => (props.$isDragging ? "none" : "translateY(-2px)")};
  }
`;

const ProfileImage = styled.div<ProfileImageProps>`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  background-image: ${(props) =>
    props.$imageUrl ? `url(${props.$imageUrl})` : "none"};
  background-color: ${(props) => (props.$imageUrl ? "transparent" : "#cccccc")};
  background-size: cover;
  background-position: center;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Username = styled.span`
  font-size: 1.2rem;
  color: #333333;
  max-width: 6rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProgressBarContainer = styled.div`
  width: calc(100% - 4rem);
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  margin: 1rem auto;
  cursor: pointer;
  position: relative;

  &:hover {
    height: 6px;
    margin-top: calc(1rem - 1px);
    margin-bottom: calc(1rem - 1px);
  }
`;

const ProgressBar = styled.div<{$progress: number}>`
  width: ${(props) => props.$progress}%;
  height: 100%;
  background-color: #333333;
  border-radius: 2px;
  transition: width 0.1s ease;
`;

export default UploaderList;
