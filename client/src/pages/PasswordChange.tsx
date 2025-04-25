import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { api } from "../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ProfileValues {
  old_password: string;
  new_password: string;
  password_check: string;
}

interface ErrorMsg {
  old_password: string;
  password_check: string;
}

const PasswordChange = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const memberNo = useSelector((state: RootState) => state.user.memberNo);

  const [values, setValues] = useState<ProfileValues>({
    old_password: "",
    new_password: "",
    password_check: "",
  });

  const [errorMsg, setErrorMsg] = useState<ErrorMsg>({
    old_password: "",
    password_check: "",
  });

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickSaveBtn = async () => {
    // 비밀번호 확인 검증
    if (values.new_password !== values.password_check) {
      setErrorMsg((prev) => ({
        ...prev,
        password_check: "새 비밀번호가 일치하지 않습니다.",
      }));
      return;
    }

    // 이전 에러 메시지 초기화
    setErrorMsg({
      old_password: "",
      password_check: "",
    });

    try {
      const response = await api.patch("/password", {
        memberNo: memberNo,
        currentPassword: values.old_password,
        newPassword: values.new_password,
      });

      if (response.data.code === 0) {
        // 성공적으로 변경됨
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/settings");
      } else if (response.data.code === 4) {
        // 기존 비밀번호가 틀린 경우
        setErrorMsg((prev) => ({
          ...prev,
          old_password: "기존 비밀번호가 일치하지 않습니다.",
        }));
      }
    } catch (error) {
      console.log(error);

      // 서버 에러 (code 6) 또는 기타 에러
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Header onClick={() => navigate("/settings")}>
        <ChevronLeft size={22} />
        <Title>{t("settings.password")}</Title>
      </Header>

      <FormContainer>
        <InputContainer>
          <InputTitle>
            {t("settings.passwordSettings.currentPassword")}
          </InputTitle>
          <StyledInput
            type="password"
            name="old_password"
            value={values.old_password}
            onChange={onChangeValues}
            placeholder={t(
              "settings.passwordSettings.currentPasswordPlaceholder"
            )}
          />
          {errorMsg.old_password && (
            <ErrorMessage>
              {t("settings.passwordSettings.errors.currentPasswordMismatch")}
            </ErrorMessage>
          )}
        </InputContainer>

        <InputContainer>
          <InputTitle>{t("settings.passwordSettings.newPassword")}</InputTitle>
          <StyledInput
            type="password"
            name="new_password"
            value={values.new_password}
            onChange={onChangeValues}
            placeholder={t("settings.passwordSettings.newPasswordPlaceholder")}
          />
        </InputContainer>

        <InputContainer>
          <InputTitle>
            {t("settings.passwordSettings.confirmPassword")}
          </InputTitle>
          <StyledInput
            type="password"
            name="password_check"
            value={values.password_check}
            onChange={onChangeValues}
            placeholder={t(
              "settings.passwordSettings.confirmPasswordPlaceholder"
            )}
          />
          {errorMsg.password_check && (
            <ErrorMessage>
              {t("settings.passwordSettings.errors.passwordMismatch")}
            </ErrorMessage>
          )}
        </InputContainer>

        <SaveButton onClick={handleClickSaveBtn}>
          {t("settings.passwordSettings.change")}
        </SaveButton>
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
  padding: 12px 0;
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

const ErrorMessage = styled.p`
  color: #eb3553;
  font-size: 12px;
  margin-top: 4px;
`;
