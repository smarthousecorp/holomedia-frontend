// src/components/Sidebar.tsx
import {useEffect, useState} from "react";
import styled, {css} from "styled-components";
import {api} from "../../utils/api";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setViewMode, ViewMode} from "../../store/slices/view";

const Sidebar = () => {
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
      <ul>
        <SidebarLi
          $isSelected={currentMode === "new" && !currentUploader}
          onClick={() => handleModeChange("new")}
        >
          NEW
        </SidebarLi>
        <SidebarLi
          $isSelected={currentMode === "best" && !currentUploader}
          onClick={() => handleModeChange("best")}
        >
          실시간 베스트
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
      </ul>
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
  height: 100%;
  /* border-right: 1px solid rgb(226, 226, 226); */
  background-color: #000000;
  color: white;
  text-align: center;
`;

const SidebarLi = styled.li<{$isSelected: boolean}>`
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
