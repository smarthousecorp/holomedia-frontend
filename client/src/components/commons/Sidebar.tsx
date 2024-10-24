import styled from "styled-components";

const Sidebar = () => {
  return (
    <SidebarContainer>
      <ul>
        <SidebarLi>인기 순위</SidebarLi>
        <SidebarLi>민지</SidebarLi>
        <SidebarLi>수민</SidebarLi>
        <SidebarLi>채희</SidebarLi>
        <SidebarLi>나라</SidebarLi>
      </ul>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.nav`
  position: fixed;
  top: 9.6rem;
  bottom: 0;
  left: 0;
  z-index: 599;
  width: 25rem;
  height: 100%;
  border-right: 1px solid rgb(226, 226, 226);
  color: white;
  text-align: center;
`;

const SidebarLi = styled.li`
  font-size: 1.8rem;
  padding: 0.8rem 0;
  cursor: pointer;
`;
