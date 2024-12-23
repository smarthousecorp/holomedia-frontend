import styled from "styled-components";

const DevToolsAlert = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <Container>
            <Message>HOLOMEDIA에서는 개발자 도구를 사용할 수 없습니다.</Message>
            <BackButton onClick={handleGoBack}>← 돌아가기</BackButton>
        </Container>
    );
};

export default DevToolsAlert;

const Container = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    color: #000000;
    gap: 3rem;
    text-align: center;
    padding: 0 2rem;
`;

const Message = styled.p`
    font-size: 16px;
    font-weight: 600;
    color: #F64E60;
`;

const BackButton = styled.button`
    padding: 0.5rem 1rem;
    font-size: 14px;
    color: #6c757d;
    background: transparent;
    border: 1px solid #6c757d;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background: #6c757d;
        color: white;
    }
`;