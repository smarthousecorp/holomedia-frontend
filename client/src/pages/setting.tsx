import styled from "styled-components";
import { ChevronRight } from "lucide-react";

const Settings = () => {
  const menuItems = [
    { id: 1, label: "프로필 설정" },
    { id: 2, label: "계정 설정" },
    { id: 3, label: "결제 관리" },
    { id: 4, label: "비밀번호 변경" },
    { id: 5, label: "로그아웃" },
  ];

  return (
    <Container>
      <Header>설정</Header>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.id}>
            <MenuText>{item.label}</MenuText>
            <ChevronRight size={20} color="#999" />
          </MenuItem>
        ))}
      </MenuList>
    </Container>
  );
};

export default Settings;

const Container = styled.section`
  max-width: 768px;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  padding: 12px;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
`;

const MenuItem = styled.div`
font-family: "Pretendard-Bold";
  max-width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const MenuText = styled.span`
  font-size: 14px;
  color: #333;
`;