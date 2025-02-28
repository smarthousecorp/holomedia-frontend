import { ReactNode } from "react";
import styled from "styled-components";
// import { X } from "lucide-react";

// Types
type ModalType = "success" | "warning" | "error" | "confirmation" | "info";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: ReactNode;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  children?: ReactNode;
}

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  content,
  type = "info",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  // Determine if it's a confirmation modal that needs two buttons
  const isConfirmation = type === "confirmation" || onConfirm;

  return (
    <ModalOverlay>
      <ModalContainer>
        {/* <ModalCloseButton onClick={onClose}>
          <X size={20} />
        </ModalCloseButton> */}

        {title && <ModalTitle>{title}</ModalTitle>}

        {content && <ModalContent>{content}</ModalContent>}

        {children}

        {isConfirmation ? (
          <ModalButtonGroup>
            <ModalCancelButton onClick={onClose}>
              {cancelText}
            </ModalCancelButton>
            <ModalConfirmButton onClick={onConfirm}>
              {confirmText}
            </ModalConfirmButton>
          </ModalButtonGroup>
        ) : (
          <ModalButton onClick={onClose}>{confirmText}</ModalButton>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

// Pre-configured modal variants
export const SuccessModal = (props: Omit<ModalProps, "type">) => (
  <Modal {...props} type="success" />
);

export const ConfirmationModal = (props: Omit<ModalProps, "type">) => (
  <Modal {...props} type="confirmation" />
);

export const WarningModal = (props: Omit<ModalProps, "type">) => (
  <Modal {...props} type="warning" />
);

export const ErrorModal = (props: Omit<ModalProps, "type">) => (
  <Modal {...props} type="error" />
);

export const InfoModal = (props: Omit<ModalProps, "type">) => (
  <Modal {...props} type="info" />
);

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// const ModalCloseButton = styled.button`
//   position: absolute;
//   top: 16px;
//   right: 16px;
//   background: none;
//   border: none;
//   cursor: pointer;
//   color: #6b7280;

//   &:hover {
//     color: #374151;
//   }
// `;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #111827;
`;

const ModalContent = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
  margin-bottom: 24px;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #dc2626;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalCancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ModalConfirmButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #dc2626;
  }
`;
