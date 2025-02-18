import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getTextStats } from "../utils/getTextStats";

interface ProfileValues {
  user_id: string;
  nickname: string;
  description: string;
}

const ProfileSetting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [values, setValues] = useState<ProfileValues>({
    user_id: "",
    nickname: "",
    description: "",
  });

  const [textStats, setTextStats] = useState({
    textLength: 0,
    textContent: "",
    withoutSpaces: 0,
  });

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangeDescription = (content: string): void => {
    setValues((prev) => ({
      ...prev,
      description: content,
    }));
    setTextStats(getTextStats(content));
  };

  console.log(textStats);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
  ];

  return (
    <Container>
      <Header onClick={() => navigate("/settings")}>
        <ChevronLeft size={22} />
        <Title>{t("settings.profile")}</Title>
      </Header>

      <FormContainer>
        <InputContainer>
          <InputTitle>사용자 ID</InputTitle>
          <StyledInput
            type="text"
            name="user_id"
            value={values.user_id}
            onChange={onChangeValues}
            placeholder="사용자 ID를 입력하세요"
          />
        </InputContainer>

        <InputContainer>
          <InputTitle>닉네임</InputTitle>
          <StyledInput
            type="text"
            name="nickname"
            value={values.nickname}
            onChange={onChangeValues}
            placeholder="닉네임을 입력하세요"
          />
        </InputContainer>

        <InputContainer>
          <DescriptionHeader>
            <InputTitle>소개</InputTitle>
            <CharCount>{`${textStats.textLength} / 2000`}</CharCount>
          </DescriptionHeader>
          <QuillWrapper>
            <ReactQuill
              value={values.description}
              onChange={onChangeDescription}
              modules={modules}
              formats={formats}
              placeholder="자기소개를 입력하세요"
              theme="snow"
            />
          </QuillWrapper>
        </InputContainer>

        <SaveButton>저장</SaveButton>
      </FormContainer>
    </Container>
  );
};

export default ProfileSetting;

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
  margin-bottom: 0.5rem;
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

const DescriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CharCount = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const QuillWrapper = styled.div`
  .ql-container {
    min-height: 120px;
    font-size: 14px;
    font-family: inherit;
    border-radius: 0 0 8px 8px;
  }

  .ql-editor {
    min-height: 120px;
  }

  .ql-toolbar {
    border: 1px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
  }

  .ql-container {
    border: 1px solid #e5e7eb;
    border-top: none;
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
