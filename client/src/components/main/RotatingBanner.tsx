// 메인화면의 롤링되는 세로배너
import { useState, useEffect } from "react";
import styled from "styled-components";
import mainBanner1 from "../../assets/holomedia_main_banner1.jpg";
import mainBanner2 from "../../assets/holomedia_main_banner2.jpg";

interface Banner {
  imageUrl: string;
  link: string;
  alt: string;
}

const RotatingBanner = () => {
  const banners: Banner[] = [
    {
      imageUrl: mainBanner1,
      link: "https://hollybam.com",
      alt: "광고 배너 1",
    },
    {
      imageUrl: mainBanner2, // 두 번째 배너 이미지 import 필요
      link: "https://hollybam.com",
      alt: "광고 배너 2",
    },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // 10초마다 변경

    return () => clearInterval(timer);
  }, []);

  const handleBannerClick = () => {
    window.open(banners[currentBannerIndex].link);
  };

  return (
    <BannerContainer>
      <BannerImage
        src={banners[currentBannerIndex].imageUrl}
        alt={banners[currentBannerIndex].alt}
        onClick={handleBannerClick}
      />
      <IndicatorContainer>
        {banners.map((_, index) => (
          <Indicator
            key={index}
            active={index === currentBannerIndex}
            onClick={() => setCurrentBannerIndex(index)}
          />
        ))}
      </IndicatorContainer>
    </BannerContainer>
  );
};

const BannerContainer = styled.div`
  position: relative;
  width: 200px;
`;

const BannerImage = styled.img`
  cursor: pointer;
  width: 200px;
  height: 540px;
  transition: opacity 0.3s ease-in-out;
`;

const IndicatorContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

const Indicator = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.active ? "#eb3553" : "rgba(255, 255, 255, 0.5)"};
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

export default RotatingBanner;
