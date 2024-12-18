import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getCookie } from "../../utils/cookie";
import { useState, useEffect } from "react";
import styled from "styled-components";

interface UploaderRouteProps {
  children: React.ReactNode;
}

const CustomAlert = () => {
  return (
    <AlertContainer>
      <AlertContent>
        <IconWrapper>
          <AlertIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
          </AlertIcon>
        </IconWrapper>
        <TextContainer>
          <AlertTitle>접근 제한</AlertTitle>
          <AlertMessage>죄송합니다. 이 페이지는 업로더만 접근할 수 있습니다.</AlertMessage>
        </TextContainer>
      </AlertContent>
    </AlertContainer>
  );
};

const UploaderRoute = ({ children }: UploaderRouteProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const isUploader = useSelector((state: RootState) => state.user.is_uploader);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // Check if user is logged in
  const token = localStorage.getItem("accessToken") || getCookie("accessToken");
  
  // Determine the route behavior
  useEffect(() => {
    if (!isLoggedIn && !token) {
      // Redirect to home if not logged in
      window.location.href = "/";
      return;
    }

    if (!isUploader) {
      // Show alert if not an uploader
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isUploader, token]);

  // If not an uploader, redirect to main
  if (!isUploader) {
    return (
      <>
        {showAlert && <CustomAlert />}
        <Navigate to="/main" replace />
      </>
    );
  }

  // If user is an uploader, render children
  return <>{children}</>;
};

export default UploaderRoute;

const AlertContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #fef2f2;
  border: 1px solid #f87171;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  z-index: 50;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const AlertContent = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  padding: 0.25rem 0;
`;

const AlertIcon = styled.svg`
  fill: currentColor;
  height: 1.5rem;
  width: 1.5rem;
  color: #ef4444;
  margin-right: 1rem;
`;

const TextContainer = styled.div``;

const AlertTitle = styled.p`
  font-weight: bold;
`;

const AlertMessage = styled.p`
  font-size: 0.875rem;
`;
