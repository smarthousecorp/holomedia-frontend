// hooks/useAdultVerification.ts
import { useState, useCallback } from "react";

export const useAdultVerification = () => {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const openVerificationModal = useCallback(() => {
    setIsVerificationModalOpen(true);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setIsVerificationModalOpen(false);
  }, []);

  const handleVerificationComplete = useCallback(() => {
    setIsVerified(true);
    setIsVerificationModalOpen(false);
  }, []);

  return {
    isVerificationModalOpen,
    isVerified,
    openVerificationModal,
    closeVerificationModal,
    handleVerificationComplete,
  };
};
