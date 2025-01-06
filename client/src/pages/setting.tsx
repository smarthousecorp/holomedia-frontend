import { useState } from "react";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const menuItems = [
    { id: 1, label: t("settings.profile"), link: "profile" },
    { id: 2, label: t("settings.account"), link: "account" },
    { id: 3, label: t("settings.payment"), link: "payment-manage" },
    { id: 4, label: t("settings.password"), link: "password-change" },
    { id: 5, label: t("settings.logout") },
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
        {t("common.cancel")}
      </Button>
      <Button onClick={handleLogout} variant="modal-action" radius="4px">
        {t("settings.logout")}
      </Button>
    </>
  );

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
        <Modal
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          title={t("settings.logoutModal.title")}
          footer={logoutFooter}
        >
          {t("settings.logoutModal.message")}
        </Modal>
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
