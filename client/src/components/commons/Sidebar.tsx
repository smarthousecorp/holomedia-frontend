import {useEffect, useState} from "react";
import styled, {css} from "styled-components";
import {api} from "../../utils/api";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setViewMode, ViewMode} from "../../store/slices/view";
import LanguageSwitcher from "./LanguageSwitcher";
import {useTranslation} from "react-i18next";

const Sidebar = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {currentMode, currentUploader} = useSelector(
    (state: RootState) => state.view
  );
  const [uploaders, setUploaders] = useState<string[]>([]);

  useEffect(() => {
    const fetchUploaderData = async () => {
      try {
        const response = await api.get(`/media/uploaders`);
        const uploadersData = response.data.data;
        setUploaders(uploadersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUploaderData();
  }, []);

  const handleModeChange = (mode: ViewMode, uploader?: string) => {
    dispatch(setViewMode({mode, uploader}));
  };

  return (
    <SidebarContainer>
      <ContentWrapper>
        <NavList>
          <SidebarLi
            $isSelected={currentMode === "new" && !currentUploader}
            onClick={() => handleModeChange("new")}
          >
            {t("sidebar.new")}
          </SidebarLi>
          <SidebarLi
            $isSelected={currentMode === "best" && !currentUploader}
            onClick={() => handleModeChange("best")}
          >
            {t("sidebar.realTimeBest")}
          </SidebarLi>
          {uploaders.map((uploader) => (
            <SidebarLi
              key={uploader}
              $isSelected={
                currentMode === "weekly" && currentUploader === uploader
              }
              onClick={() => handleModeChange("weekly", uploader)}
            >
              {uploader}
            </SidebarLi>
          ))}
        </NavList>
      </ContentWrapper>
      <LanguageSwitcherWrapper>
        <LanguageSwitcher />
      </LanguageSwitcherWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.nav`
  position: fixed;
  top: 8rem;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 25rem;
  background-color: #000000;
  color: white;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 8rem); // 상단 8rem을 제외한 높이
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const NavList = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
`;

const LanguageSwitcherWrapper = styled.div`
  border-top: 1px solid white;
  padding: 1.5rem;
  background-color: #000000;
`;

const SidebarLi = styled.li<{$isSelected: boolean}>`
  text-align: center;
  font-size: 1.8rem;
  padding: 1.5rem 0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

  ${({$isSelected}) =>
    $isSelected &&
    css`
      color: #ff627c;
      background-color: rgba(255, 98, 124, 0.1);
      font-weight: 500;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background-color: #ff627c;
      }

      &:hover {
        background-color: rgba(255, 98, 124, 0.15);
      }
    `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
