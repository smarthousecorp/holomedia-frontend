import styled from "styled-components";

const Sidebar = () => {
  return (
    <SidebarContainer>
      <ul>
        <SidebarLi>NEW</SidebarLi>
        <SidebarLi>실시간 베스트</SidebarLi>
        <SidebarLi>민지</SidebarLi>
        <SidebarLi>수민</SidebarLi>
        <SidebarLi>채희</SidebarLi>
        <SidebarLi>나라</SidebarLi>
        <SidebarLi>미주</SidebarLi>
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

const SidebarLi = styled.li`
  font-size: 1.8rem;
  padding: 1.5rem 0;
  cursor: pointer;
`;
