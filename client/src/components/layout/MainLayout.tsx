import {Outlet} from "react-router";
import {styled} from "styled-components";
import Header from "../commons/Header";
import Sidebar from "../commons/Sidebar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useEffect} from "react";
import {close, open, setSidebarState} from "../../store/slices/sidebar";
import {hide, setHeaderState, view} from "../../store/slices/header";

const MainLayout = () => {
  const sidebar = useSelector((state: RootState) => state.sidebar.isOpen);

  const dispatch = useDispatch();

  useEffect(() => {
    // 초기 사이드바, 햄버거 상태 설정
    const initialSidebarState = window.innerWidth > 1310;
    const initialHeaderState = !initialSidebarState;
    dispatch(setSidebarState(initialSidebarState));
    dispatch(setHeaderState(initialHeaderState));

    const handleResize = () => {
      if (window.innerWidth <= 1310) {
        dispatch(close());
        dispatch(view());
      } else {
        dispatch(open());
        dispatch(hide());
      }
    };

    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return (
    <Full>
      <Header />
      <Inner>
        {sidebar && <Sidebar />}
        <Container open={sidebar}>
          <Outlet />
        </Container>
      </Inner>
    </Full>
  );
};

const Full = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000000;
  padding-top: 8rem;
  display: flex;
`;

const Container = styled.main<{open: boolean}>`
  width: 100%;
  padding-left: ${({open}) => (open ? "25rem" : "0")};
  /* transition: padding-left 0.3s ease; // 부드러운 전환 효과 추가 */
`;

export default MainLayout;
