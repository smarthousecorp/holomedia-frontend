import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ChevronLeft, Camera, X } from "lucide-react";
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
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "withdrawal">(
    "success"
  );

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
        setModalType("success");
        setShowModal(true);
        // 모달에서 확인 버튼 클릭 시 navigate("/settings")로 이동
      }
    } catch (error) {
      alert("프로필 수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleWithdrawal = () => {
    setModalType("withdrawal");
    setShowModal(true);
  };

  const confirmWithdrawal = async () => {
    try {
      // 회원탈퇴 API 호출 로직 추가
      const response = await api.delete(`/member/${memberNo}`);
      console.log(response);

      // 탈퇴 성공 시 로그인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("회원탈퇴 중 오류가 발생했습니다:", error);
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
        <WithdrawalLink onClick={handleWithdrawal}>회원탈퇴</WithdrawalLink>
      </FormContainer>

      {/* 모달 */}
      {showModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalCloseButton onClick={() => setShowModal(false)}>
              <X size={20} />
            </ModalCloseButton>

            {modalType === "success" ? (
              <>
                <ModalTitle>프로필 수정 완료</ModalTitle>
                <ModalContent>프로필이 성공적으로 수정되었습니다.</ModalContent>
                <ModalButton
                  onClick={() => {
                    setShowModal(false);
                    navigate("/settings");
                  }}
                >
                  확인
                </ModalButton>
              </>
            ) : (
              <>
                <ModalTitle>회원탈퇴</ModalTitle>
                <ModalContent>
                  정말 회원탈퇴를 진행하시겠습니까?
                  <br />
                  탈퇴 시 계정 정보가 모두 삭제됩니다.
                </ModalContent>
                <ModalButtonGroup>
                  <ModalCancelButton onClick={() => setShowModal(false)}>
                    취소
                  </ModalCancelButton>
                  <ModalConfirmButton onClick={confirmWithdrawal}>
                    탈퇴하기
                  </ModalConfirmButton>
                </ModalButtonGroup>
              </>
            )}
          </ModalContainer>
        </ModalOverlay>
      )}
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
  margin-top: ${(props) => (props.className === "nickname" ? "30px" : "0")};
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

const SaveButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #dc2626;
  }
`;

const WithdrawalLink = styled.span`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #ef4444;
  }
`;

// 모달 관련 스타일
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

const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #374151;
  }
`;

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
