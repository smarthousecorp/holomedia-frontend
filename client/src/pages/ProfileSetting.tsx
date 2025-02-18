import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ChevronLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { api } from "../utils/api";

interface ProfileValues {
  userId: string;
  nickname: string;
  profile?: File;
  background?: File;
}

interface UserData {
  memberNo: number;
  nickname: string;
  point: number;
  loginId: string;
  urls: {
    background: string;
    profile: string;
  };
}

const ProfileSetting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const memberNo = useSelector((state: RootState) => state.user.memberNo);

  const [values, setValues] = useState<ProfileValues>({
    userId: "",
    nickname: "",
  });

  const [previewUrls, setPreviewUrls] = useState({
    profile: "",
    background: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get<{
          code: number;
          message: string;
          data: UserData;
        }>(`/member?memberNo=${memberNo}`);

        if (response.data.code === 0) {
          const userData = response.data.data;
          setValues((prev) => ({
            ...prev,
            userId: userData.loginId,
            nickname: userData.nickname,
          }));

          setPreviewUrls({
            profile: userData.urls.profile,
            background: userData.urls.background,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        alert("사용자 정보를 불러오는데 실패했습니다.");
      }
    };

    if (memberNo) {
      fetchUserData();
    }
  }, [memberNo]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setValues((prev) => ({
        ...prev,
        [name]: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // JSON 데이터를 Blob으로 변환하여 FormData에 추가
      const jsonData = {
        memberNo: memberNo,
        nickname: values.nickname,
      };
      const jsonBlob = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      });
      formData.append("data", jsonBlob);

      // 파일이 있는 경우에만 FormData에 추가
      if (values.profile) {
        formData.append("profile", values.profile);
      }
      if (values.background) {
        formData.append("background", values.background);
      }

      const response = await api.patch("/member", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code === 0) {
        alert("프로필이 성공적으로 수정되었습니다.");
        navigate("/settings");
      }
    } catch (error) {
      alert("프로필 수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <Container>
      <Header onClick={() => navigate("/settings")}>
        <ChevronLeft size={22} />
        <Title>{t("settings.profile")}</Title>
      </Header>

      <FormContainer>
        <BackgroundContainer>
          <BackgroundImage url={previewUrls.background}>
            <FileInput
              type="file"
              name="background"
              accept="image/*"
              onChange={handleFileChange}
              id="background-upload"
            />
            <FileInputLabelBG htmlFor="background-upload">
              <Camera size={24} />
            </FileInputLabelBG>
          </BackgroundImage>
        </BackgroundContainer>

        <ProfileImageContainer>
          <ProfileImage url={previewUrls.profile}>
            <FileInput
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleFileChange}
              id="profile-upload"
            />
            <FileInputLabel htmlFor="profile-upload">
              <Camera size={20} />
            </FileInputLabel>
          </ProfileImage>
        </ProfileImageContainer>

        <InputContainer>
          <InputLabel>사용자 ID</InputLabel>
          <StyledInput
            type="text"
            name="userId"
            value={values.userId}
            readOnly
            disabled
            style={{ backgroundColor: "#f3f4f6" }}
          />
        </InputContainer>

        <InputContainer>
          <InputLabel>닉네임</InputLabel>
          <StyledInput
            type="text"
            name="nickname"
            value={values.nickname}
            onChange={onChangeValues}
            placeholder="닉네임"
          />
        </InputContainer>

        <SaveButton onClick={handleSave}>저장</SaveButton>
      </FormContainer>
    </Container>
  );
};

export default ProfileSetting;

const Container = styled.section`
  max-width: 468px;
  padding: 20px;
  position: relative;
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
  gap: 1.5rem;
`;

const BackgroundContainer = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  margin-bottom: 40px;
`;

const BackgroundImage = styled.div<{ url: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) => (props.url ? `url(${props.url})` : "#f3f4f6")};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
`;

const ProfileImageContainer = styled.div`
  position: absolute;
  /* top: 150px; // 위치 조정
  left: 50%; // 중앙 정렬을 위해
  transform: translateX(-50%); // 중앙 정렬을 위해 */

  top: 200px;
  left: 40px;
  z-index: 1;
`;

const ProfileImage = styled.div<{ url: string }>`
  width: 70px;
  height: 70px;
  background: ${(props) => (props.url ? `url(${props.url})` : "#f3f4f6")};
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  position: relative;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
`;

const FileInputLabelBG = styled.label`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: ${(props) =>
    props.className === "nickname"
      ? "30px"
      : "0"}; // 첫 번째 입력 필드의 마진 조정
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

// const StyledTextArea = styled.textarea`
//   width: 100%;
//   min-height: 120px;
//   padding: 12px;
//   border: 1px solid #e5e7eb;
//   border-radius: 8px;
//   font-size: 14px;
//   resize: vertical;
//   line-height: 1.5;

//   &:focus {
//     outline: none;
//     border-color: #94a3b8;
//   }

//   &::placeholder {
//     color: #9ca3af;
//   }
// `;

// const CharCount = styled.span`
//   font-size: 12px;
//   color: #6b7280;
//   text-align: right;
// `;

const SaveButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #7c3aed;
  }
`;
