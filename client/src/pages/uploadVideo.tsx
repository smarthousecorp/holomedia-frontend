import React, {useState, ChangeEvent} from "react";
import styled from "styled-components";
import useUploadImage from "../hooks/useUploadImage";
import useUploadVideo from "../hooks/useUploadVideo"; // 새로 만들어야 할 훅
import {api} from "../utils/api";

import {useTranslation} from "react-i18next";

interface UploadFormData {
  title: string;
  url: string;
  video_file: File | null; // 추가된 비디오 파일
  non_thumbnail: File | null;
  member_thumbnail: File | null;
  name: string;
}

export default function UploadForm() {
  const {t} = useTranslation();

  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    url: "",
    video_file: null, // 초기값 추가
    non_thumbnail: null,
    member_thumbnail: null,
    name: "",
  });

  const [previews, setPreviews] = useState({
    non_thumbnail: "",
    member_thumbnail: "",
    video_file: "", // 비디오 미리보기 URL
  });

  // 이미지 업로드 커스텀훅
  const uploadImage = useUploadImage();
  const uploadVideo = useUploadVideo(); // 비디오 업로드용 커스텀훅

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      // 비디오 파일인 경우 미리보기 생성
      if (name === "video_file" && files[0].type.startsWith("video/")) {
        const previewUrl = URL.createObjectURL(files[0]);
        setPreviews((prev) => ({
          ...prev,
          [name]: previewUrl,
        }));
      }
      // 이미지 파일인 경우 기존 로직 유지
      else if (files[0].type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(files[0]);
        setPreviews((prev) => ({
          ...prev,
          [name]: previewUrl,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // 기본 필드들 추가
      Object.entries(formData).forEach(([key, value]) => {
        console.log(key, value);

        if (
          !["non_thumbnail", "member_thumbnail", "video_file", "url"].includes(
            key
          )
        ) {
          formDataToSend.append(key, value);
        }
      });

      // 비디오 파일 업로드
      if (formData.video_file) {
        const videoUrl = await uploadVideo(formData.video_file);
        formDataToSend.append("url", videoUrl); // 기존 url 필드에 업로드된 비디오 URL 저장
      }

      // 이미지 업로드
      if (formData.non_thumbnail) {
        const nonDownloadUrl = await uploadImage(formData.non_thumbnail);
        formDataToSend.append("non_thumbnail", nonDownloadUrl);
      }

      if (formData.member_thumbnail) {
        const memberDownloadUrl = await uploadImage(formData.member_thumbnail);
        formDataToSend.append("member_thumbnail", memberDownloadUrl);
      }

      const response = await api.post("/media", formDataToSend);

      if (response.status === 200) {
        alert(t("upload.messages.uploadSuccess"));
        setFormData({
          title: "",
          url: "",
          video_file: null,
          non_thumbnail: null,
          member_thumbnail: null,
          name: "",
        });
        setPreviews({
          non_thumbnail: "",
          member_thumbnail: "",
          video_file: "",
        });
      } else {
        alert(t("upload.messages.uploadError"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(t("upload.messages.uploadError"));
    }
  };

  return (
    <Container>
      <Title>{t("upload.pageTitle")}</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>{t("upload.form.videoTitle.label")}</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t("upload.form.videoTitle.placeholder")}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t("upload.form.videoFile.label")}</Label>
          <FileUploadContainer>
            <FileUploadLabel>
              {previews.video_file ? (
                <video
                  src={previews.video_file}
                  controls
                  style={{width: "100%", height: "100%", objectFit: "contain"}}
                />
              ) : (
                <>
                  <UploadIcon>📹</UploadIcon>
                  <UploadText>
                    {t("upload.form.videoFile.uploadText")}
                  </UploadText>
                </>
              )}
              <input
                type="file"
                name="video_file"
                onChange={handleFileChange}
                style={{display: "none"}}
                accept="video/*"
                required
              />
            </FileUploadLabel>
          </FileUploadContainer>
        </FormGroup>

        <FormGroup>
          <Label>{t("upload.form.nonMemberThumbnail.label")}</Label>
          <FileUploadContainer>
            <FileUploadLabel>
              {previews.non_thumbnail ? (
                <PreviewImage src={previews.non_thumbnail} alt="Preview" />
              ) : (
                <>
                  <UploadIcon>📤</UploadIcon>
                  <UploadText>
                    {t("upload.form.nonMemberThumbnail.uploadText")}
                  </UploadText>
                </>
              )}
              <input
                type="file"
                name="non_thumbnail"
                onChange={handleFileChange}
                style={{display: "none"}}
                accept="image/*"
                required
              />
            </FileUploadLabel>
          </FileUploadContainer>
        </FormGroup>

        <FormGroup>
          <Label>{t("upload.form.memberThumbnail.label")}</Label>
          <FileUploadContainer>
            <FileUploadLabel>
              {previews.member_thumbnail ? (
                <PreviewImage src={previews.member_thumbnail} alt="Preview" />
              ) : (
                <>
                  <UploadIcon>📤</UploadIcon>
                  <UploadText>
                    {t("upload.form.memberThumbnail.uploadText")}
                  </UploadText>
                </>
              )}
              <input
                type="file"
                name="member_thumbnail"
                onChange={handleFileChange}
                style={{display: "none"}}
                accept="image/*"
                required
              />
            </FileUploadLabel>
          </FileUploadContainer>
        </FormGroup>

        <FormGroup>
          <Label>{t("upload.form.creatorName.label")}</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t("upload.form.creatorName.placeholder")}
            required
          />
        </FormGroup>

        <SubmitButton type="submit">{t("upload.form.submit")}</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem;
  color: white;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: white;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #e2e8f0;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 0.5rem;
  color: white;
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
  }

  &::placeholder {
    color: #666;
  }
`;

const FileUploadContainer = styled.div`
  margin-top: 0.5rem;
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20rem;
  border: 2px dashed #333;
  border-radius: 1rem;
  cursor: pointer;
  background-color: #1a1a1a;
  transition: all 0.2s ease;

  &:hover {
    background-color: #242424;
    border-color: #3b82f6;
  }

  @media (max-width: 768px) {
    height: 16rem;
  }
`;

const UploadIcon = styled.span`
  font-size: 3rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const UploadText = styled.p`
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  color: #999;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.8rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1.4rem;
  }
`;
