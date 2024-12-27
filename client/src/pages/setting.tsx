import { useState } from "react";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/commons/Modal";
import Button from "../components/commons/Button";
import { removeCookie } from "../utils/cookie";

interface MenuItemProps {
  id: number;
  label: string;
  link?: string;
}

const Settings = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, label: "프로필 설정", link: "profile" },
    { id: 2, label: "계정 설정", link: "account" },
    { id: 3, label: "결제 관리", link: "payment-manage" },
    { id: 4, label: "비밀번호 변경", link: "password-change" },
    { id: 5, label: "로그아웃" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    removeCookie("accessToken");
    navigate("/");
  };

  const handleMenuClick = (item: MenuItemProps) => {
    if (item.id === 5) {
      setIsLogoutDialogOpen(true);
    } else {
      navigate(`${item.link}`);
    }
  };

  const logoutFooter = (
    <>
      <Button
        onClick={() => setIsLogoutDialogOpen(false)}
        variant="modal-cancel"
        radius="4px"
      >
        취소
      </Button>
      <Button onClick={handleLogout} variant="modal-action" radius="4px">
        로그아웃
      </Button>
    </>
  );

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

      {isLogoutDialogOpen && (
        <Modal
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          title="로그아웃"
          footer={logoutFooter}
        >
          정말 로그아웃 하시겠습니까?
        </Modal>
      )}
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
