import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface menuItemProps {
  id: number;
  label: string;
  link?: string;
}

const Settings = () => {
  const menuItems = [
    { id: 1, label: "프로필 설정", link: "profile" },
    { id: 2, label: "계정 설정", link: "account" },
    { id: 3, label: "결제 관리", link: "payment-manage" },
    { id: 4, label: "비밀번호 변경", link: "password-change" },
    { id: 5, label: "로그아웃" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    // 여기에 로그아웃 로직을 구현하세요
    console.log("로그아웃 처리");
    // 예시:
    // localStorage.removeItem('token');
    // navigate('/login');
  };

  // navigate, logout 함수 실행 로직을 분리하기 위한 함수
  const handleMenuClick = (item: menuItemProps) => {
    if (item.id === 5) {
      handleLogout();
    } else {
      navigate(`${item.link}`);
    }
  };

  return (
    <Container>
      <Header>설정</Header>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.id} onClick={() => handleMenuClick(item)}>
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
