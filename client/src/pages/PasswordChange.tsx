import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";

interface ProfileValues {
  old_password: string;
  new_password: string;
  password_check: string;
}

const PasswordChange = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [values, setValues] = useState<ProfileValues>({
    old_password: "",
    new_password: "",
    password_check: "",
  });

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Header onClick={() => navigate("/settings")}>
        <ChevronLeft size={22} />
        <Title>{t("settings.password")}</Title>
      </Header>

      <FormContainer>
        <InputContainer>
          <InputTitle>기존 비밀번호</InputTitle>
          <StyledInput
            type="password"
            name="old_password"
            value={values.old_password}
            onChange={onChangeValues}
            placeholder="기존 비밀번호를 입력하세요"
          />
        </InputContainer>

        <InputContainer>
          <InputTitle>새 비밀번호</InputTitle>
          <StyledInput
            type="password"
            name="new_password"
            value={values.new_password}
            onChange={onChangeValues}
            placeholder="8~16자의 영문 대소문자, 숫자 및 특수문자"
          />
        </InputContainer>

        <InputContainer>
          <InputTitle>새 비밀번호 확인</InputTitle>
          <StyledInput
            type="password"
            name="new_password"
            value={values.new_password}
            onChange={onChangeValues}
            placeholder="8~16자의 영문 대소문자, 숫자 및 특수문자"
          />
        </InputContainer>

        <SaveButton>저장</SaveButton>
      </FormContainer>
    </Container>
  );
};

export default PasswordChange;

const Container = styled.section`
  max-width: 468px;
  padding: 20px;
`;

const Header = styled.div`
  cursor: pointer;
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-left: 12px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputTitle = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #94a3b8;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #eb3553;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #eb566f;
  }
`;
