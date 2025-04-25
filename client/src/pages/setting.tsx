import { useState } from "react";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "../components/commons/Modal";
import { api } from "../utils/api";

interface MenuItemProps {
  id: number;
  label: string;
  link?: string;
}

const Settings = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { id: 1, label: t("settings.profile"), link: "profile" },
    // { id: 2, label: t("settings.account"), link: "account" },
    { id: 3, label: t("settings.payment"), link: "payment-manage" },
    { id: 4, label: t("settings.password"), link: "password-change" },
    { id: 5, label: t("settings.logout") },
  ];

  const handleLogout = () => {
    api
      .post("/logout")
      .then(() => {
        localStorage.removeItem("member_No");
        navigate("/");
      })
      .catch(() => {
        console.log("로그아웃 실패");
      });
  };

  const handleMenuClick = (item: MenuItemProps) => {
    if (item.id === 5) {
      setIsLogoutDialogOpen(true);
    } else {
      navigate(`${item.link}`);
    }
  };

  return (
    <Container>
      <Header>{t("settings.title")}</Header>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.id} onClick={() => handleMenuClick(item)}>
            <MenuText>{item.label}</MenuText>
            <ChevronRight size={20} color="#999" />
          </MenuItem>
        ))}
      </MenuList>

      {isLogoutDialogOpen && (
        <ConfirmationModal
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          onConfirm={handleLogout}
          title={t("settings.logoutModal.title")}
          content={t("settings.logoutModal.message")}
          confirmText={t("common.modal.buttons.confirm")}
          cancelText={t("common.modal.buttons.cancel")}
        />
      )}
    </Container>
  );
};

export default Settings;

const Container = styled.section`
  max-width: 468px;
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
