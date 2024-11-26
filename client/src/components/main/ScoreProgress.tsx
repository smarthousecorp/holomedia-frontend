import styled from "styled-components";

interface ScoreProgressProps {
  currentScore?: number;
}

const ScoreProgress = ({currentScore = 0}: ScoreProgressProps) => {
  const scores = [10, 20, 30, 40, 50];

  return (
    <Container>
      <ContentWrapper>
        <Title>연속 출석 보상</Title>

        <ProgressContainer>
          <CircleContainer>
            {scores.map((score, index) => {
              const isActive = currentScore >= score;
              const isCurrentScore = currentScore === score;

              return (
                <ScoreItem key={index}>
                  <Circle $isActive={isActive} $isCurrent={isCurrentScore}>
                    <InnerDot $isActive={isActive} />
                  </Circle>
                  <ScoreText $isActive={isActive}>+{score}P</ScoreText>
                </ScoreItem>
              );
            })}

            <BackgroundBar />
            <ProgressBar
              $progress={Math.min(
                (currentScore / Math.max(...scores)) * 100,
                100
              )}
            />
          </CircleContainer>
        </ProgressContainer>

        <CheckButton>출석 체크</CheckButton>
      </ContentWrapper>
    </Container>
  );
};

export default ScoreProgress;

const Container = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 17px;
  padding: 1.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-family: "Pretendard-Bold";
`;

const ProgressContainer = styled.div`
  position: relative;
`;

const CircleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface CircleProps {
  $isActive: boolean;
  $isCurrent: boolean;
}

const Circle = styled.div<CircleProps>`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.4rem;
  border: 2px ${(props) => (props.$isActive ? "solid" : "dashed")} #eb3553;
  position: relative;

  ${(props) =>
    props.$isCurrent &&
    `
    &::after {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      background: rgba(109, 70, 204, 0.2);
      z-index: -1;
    }
  `}

  @media (max-width:576px) {
    width: 5.5rem;
    height: 5.5rem;
  }
`;

interface ScoreTextProps {
  $isActive: boolean;
}

const InnerDot = styled.div<ScoreTextProps>`
  width: 1rem;
  height: 1rem;
  background-color: white;
  border: ${(props) => (props.$isActive ? "1px solid #eb3553" : "none")};
  border-radius: 50%;

  @media (max-width: 576px) {
    width: 0.7rem;
    height: 0.7rem;
  }
`;

const ScoreText = styled.span<ScoreTextProps>`
  position: absolute;
  top: 1.8rem;
  font-size: 1.2rem;
  color: ${(props) => (props.$isActive ? "#eb3553" : "#999")};

  @media (max-width: 576px) {
    font-size: 0.9rem;
    top: 1.3rem;
  }
`;

const BackgroundBar = styled.div`
  position: absolute;
  top: 1.6rem;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #eee;
  z-index: -1;
`;

interface ProgressBarProps {
  $progress: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  position: absolute;
  top: 1.6rem;
  left: 0;
  width: ${(props) => props.$progress}%;
  height: 2px;
  background-color: #eb3553;
  z-index: -1;
  transition: width 0.3s ease;
`;

const CheckButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #eb3553;
  color: white;
  border-radius: 17px;
  font-size: 1.4rem;
  margin-top: 0.8rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5627b;
  }
`;
