import { useState } from "react";
import styled from "styled-components";
import Modal, {
  SuccessModal,
  ConfirmationModal,
  WarningModal,
  ErrorModal,
} from "../components/commons/Modal";

const ModalExamplePage = () => {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleConfirmAction = () => {
    // Handle confirmed action
    console.log("Action confirmed!");
    setShowConfirmModal(false);
  };

  return (
    <Container>
      <Title>Modal Examples</Title>

      <ButtonsContainer>
        <ModalButton onClick={() => setShowBasicModal(true)}>
          Open Basic Modal
        </ModalButton>

        <ModalButton onClick={() => setShowSuccessModal(true)}>
          Open Success Modal
        </ModalButton>

        <ModalButton onClick={() => setShowConfirmModal(true)}>
          Open Confirmation Modal
        </ModalButton>

        <ModalButton onClick={() => setShowWarningModal(true)}>
          Open Warning Modal
        </ModalButton>

        <ModalButton onClick={() => setShowErrorModal(true)}>
          Open Error Modal
        </ModalButton>
      </ButtonsContainer>

      {/* Basic Modal */}
      <Modal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Basic Modal"
        content="This is a basic modal with simple content."
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        content="Your action has been completed successfully."
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        content="Are you sure you want to proceed with this action?"
        confirmText="Proceed"
        cancelText="Cancel"
      />

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="Warning"
        content="Please be careful with this action. It might have consequences."
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error Occurred"
        content="Something went wrong. Please try again later."
      />
    </Container>
  );
};

export default ModalExamplePage;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalButton = styled.button`
  padding: 12px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #dc2626;
  }
`;
