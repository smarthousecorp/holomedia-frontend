import styled from "styled-components";

interface ProctectionModalProps{
  onClose?: () => void;
}

const Protection = ({ onClose }: ProctectionModalProps) => {
  return (
    <Wrapper>
      <ModalBox>    
      <Title>청소년 보호정책</Title>
      <Content>
        HOLOMEDIA 청소년 보호정책<br/>
       시행일자: 2025년 5월 27일<br/>
HOLOMEDIA(이하 “회사”)는 청소년의 인격권, 정보주권, 안전권을 최우선의 사회적 가치로 인식하고 있으며, 「청소년 보호법」, 「아동·청소년 성보호에 관한 법률」을 포함한 국내 법령과, 유엔 아동권리협약(UNCRC), ITU Child Online Protection 지침, OECD 아동 디지털 안전 프레임워크, EU BIK+ 전략, UNESCO 아동윤리 선언 등 국제기준을 포함하여 청소년 보호의 최고 수준을 준수합니다.
제1조 (정책의 목적 및 선언)<br/>
본 정책은 플랫폼 내에서의 청소년 보호를 위한 모든 기술적, 관리적, 법적 대응 절차를 규정합니다.<br/>
본 정책은 대한민국 청소년보호법을 최소 기준으로 하며, 글로벌 청소년 인권·안전 기준을 상위 지침으로 선언합니다.<br/>
회사는 청소년 보호를 이윤보다 우선되는 헌장적 가치로 선언하며, 이를 모든 내부 정책보다 우선합니다.<br/>
제2조 (정의 및 적용 대상)<br/>
“청소년”이란 만 19세 미만의 자를 의미하며, 국가별 기준이 낮을 경우 해당 기준을 따릅니다.<br/>
“유해정보”란 다음과 같은 내용을 포함합니다:<br/>
성적 노출, 자극, 불법 촬영, 가학적 성행위<br/>
자해·자살·약물·학대 조장 콘텐츠<br/>
음란물, 사행성 게임, 도박, 무기 제작 정보<br/>
미성년자 대상 온라인 유인·협박·성착취 의심 콘텐츠<br/>
제3조 (연령 확인 및 접근 통제 체계)<br/>
회원가입 시 법적 연령 이상임을 확인하기 위해 다음 인증 시스템을 적용합니다:<br/>
대한민국: 본인 명의 휴대폰 실명 인증 + 연계정보(CI) 저장<br/>
해외 사용자: 여권 또는 거주국 정부 발급 인증서 기반 KYC<br/>
고위험국 접속자: VPN·프록시·우회 IP 자동 차단 + 인증심화 단계 요구<br/>
성인 인증 실패 계정은 유해매체 접근이 100% 차단되며, 반복 시 IP 및 단말기 차단 목록에 등록됩니다.<br/>
제4조 (기술적 보호조치)<br/>
AI 기반 콘텐츠 식별 모델(GPT+CVN 기반)을 통해 업로드 전 실시간 감지 → 블록<br/>
자동화 차단 시스템은 4단계 위험등급 분류(R, SR, CR, ER) 기준으로 가중 처리<br/>
우회접속 시도, Tor 네트워크, 다크웹 호스트 탐지 시 자동 경고+계정 종료<br/>
모든 유해 게시물은 RFC 6962 기반 서명 로그로 즉시 기록 및 감사 추적 가능<br/>
성인 콘텐츠 페이지에는 HTML 기반 접근 제한이 아닌 서버단 차단 및 CDN 무효화 적용<br/>
제5조 (청소년 대상 디지털범죄 탐지 및 대응)<br/>
다음 각 호의 행위 적발 시, 고지 없이 다음 조치를 즉시 단행합니다:<br/>
아동·청소년 대상 성희롱, 음란 대화, 유인, 협박<br/>
특정 나이를 가장한 위장 접근<br/>
의심 메시지 반복 발송, 영상통화 유도, 오프라인 접촉 요청<br/>
대응 프로토콜:<br/>
AI 위험 탐지 → 로그 수집 및 캡처 보존 → 30분 이내 감사 통보<br/>
INTERPOL, FBI, 경찰청, 아동청소년성착취대응센터(NCMEC) 자동 연계 API 통보<br/>
필요 시 가해자 정보 수사기관 제출 + 계정/기기 영구 접근 차단<br/>
제6조 (운영자 교육 및 내부 통제)<br/>
모든 운영자·검수자·개발자는 청소년보호 국제윤리교육(연 2회) 필수 이수<br/>
내부 데이터 접근자는 최소권한 정책 하에, 접속로그를 5년간 암호화 보관<br/>
“디지털 유해 콘텐츠 통제 책임자(CPO)” 및 “아동디지털권리 감시관(CRC Officer)” 별도 지정<br/>
제7조 (신고 및 피해 구제)<br/>
신고 채널:<br/>
이메일: protect@holomedia.co.kr<br/>
실시간 신고: 콘텐츠 내 [즉시 차단+로그 캡처+1시간 내 답변]<br/>
외부기관: 1388청소년전화, 방심위, KISA, NCMEC 자동 연동<br/>
회사는 모든 신고에 대하여 24시간 이내 접수 응답, 72시간 내 공식 처리 보고를 제공합니다.<br/>
제8조 (국제기준 및 역외 아동보호)<br/>
플랫폼은 UN CRC 제16조(사생활 보호), 제34조(성적 유해로부터 보호)를 선언적으로 준수<br/>
GDPR-K 및 COPPA(Children’s Online Privacy Protection Act) 기반 역외 아동 접속 차단<br/>
국가별 미성년자 보호 규제 강화 시 해당국 접속을 자동 제한하거나 콘텐츠 노출 제한<br/>
제9조 (사후 대응과 재발 방지)<br/>
청소년 대상 유해사건 발생 시 즉시 감사 로그 캡처 → DPO 보고 → 자동 통보<br/>
내부 CPO는 사례를 분석하여 재발방지 가이드 및 재교육 방안 마련<br/>
필요시 해당 기능을 플랫폼 전체 일시 차단 가능<br/>
제10조 (시행 및 개정)<br/>
본 정책은 연 1회 이상 정기적으로 개정되며, 사안이 중대한 경우 30일 이상 사전 공지됩니다.<br/>
청소년 보호와 직접 관련된 기술 조치 변경은 지체 없이 반영됩니다.<br/>
[부칙]<br/>
본 정책은 2025년 5월 27일부터 시행합니다.<br/>
      </Content>
    <CloseButton onClick={onClose}>닫기</CloseButton>
    </ModalBox>
    </Wrapper>
  );
};

export default Protection;


const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 12px;
  pointer-events: auto;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background: black;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

