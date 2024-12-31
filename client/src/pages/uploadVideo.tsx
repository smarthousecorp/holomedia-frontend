// 어드민 페이지 완성되면 삭제 예정
import React, { useState, ChangeEvent, useCallback, useEffect } from "react";
import styled from "styled-components";
import useUploadImage from "../hooks/useUploadImage";
import useUploadVideo from "../hooks/useUploadVideo";
import { api } from "../utils/api";
import VideoThumbnailSelector from "../components/commons/media/VideoThumbnailSelector";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface UploadFormData {
  title: string;
  url: string;
  video_file: File | null;
  thumbnail: string | null;
  name: string;
  description: string;
}

export default function UploadForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    url: "",
    video_file: null,
    thumbnail: null,
    name: "",
    description: "",
  });

  const [selectedThumbnail, setSelectedThumbnail] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");

  // 이미지 업로드 커스텀훅
  const uploadImage = useUploadImage();
  const uploadVideo = useUploadVideo();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // 비디오 파일 변경 핸들러를 useCallback으로 최적화
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, files } = e.target;
      if (files && files[0]) {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));

        if (name === "video_file" && files[0].type.startsWith("video/")) {
          // 이전 비디오 프리뷰 URL 정리
          if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
          }
          const previewUrl = URL.createObjectURL(files[0]);
          setVideoPreview(previewUrl);
        }
      }
    },
    [videoPreview]
  );

  const handleThumbnailSelect = useCallback((thumbnailUrl: string) => {
    setSelectedThumbnail(thumbnailUrl);
    setFormData((prev) => ({
      ...prev,
      thumbnail: thumbnailUrl,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // 기본 필드들 추가
      Object.entries(formData).forEach(([key, value]) => {
        if (!["video_file", "url", "thumbnail"].includes(key)) {
          formDataToSend.append(key, value);
        }
      });

      // 비디오 파일 업로드
      if (formData.video_file) {
        const videoUrl = await uploadVideo(formData.video_file);
        formDataToSend.append("url", videoUrl);
      }

      // 선택된 썸네일 업로드
      if (selectedThumbnail) {
        // Base64 데이터 URL을 File 객체로 변환
        const response = await fetch(selectedThumbnail);
        const blob = await response.blob();
        const thumbnailFile = new File([blob], "thumbnail.jpg", {
          type: "image/jpeg",
        });

        const thumbnailUrl = await uploadImage(thumbnailFile);
        formDataToSend.append("thumbnail", thumbnailUrl);
      }

      const response = await api.post("/media", formDataToSend);

      if (response.status === 200) {
        alert(t("upload.messages.uploadSuccess"));
        setFormData({
          title: "",
          url: "",
          video_file: null,
          thumbnail: null,
          name: "",
          description: "",
        });
        setVideoPreview("");
        setSelectedThumbnail("");
      } else {
        alert(t("upload.messages.uploadError"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(t("upload.messages.uploadError"));
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, []);

  // React Quill 모듈 설정
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
  ];

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
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
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
                style={{ display: "none" }}
                accept="video/*"
                required
              />
            </FileUploadLabel>
          </FileUploadContainer>
        </FormGroup>

        {formData.video_file && (
          <FormGroup>
            <Label>{t("upload.form.thumbnail.label")}</Label>
            <VideoThumbnailSelector
              videoFile={formData.video_file}
              onThumbnailSelect={handleThumbnailSelect}
              thumbnailCount={6}
            />
          </FormGroup>
        )}

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

        <FormGroup>
          <Label>{t("upload.form.description.label")}</Label>
          <EditorContainer>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={modules}
              formats={formats}
              placeholder={t("upload.form.description.placeholder")}
            />
          </EditorContainer>
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
  color: #333;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: #333;

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
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  color: #333;
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
  }

  &::placeholder {
    color: #999;
  }
`;

const EditorContainer = styled.div`
  .ql-container {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    background: #ffffff;
    min-height: 15rem;
  }

  .ql-toolbar {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background: #ffffff;
  }

  .ql-editor {
    min-height: 15rem;
    font-size: 1.4rem;
    color: #333;
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
  border: 2px dashed #ddd;
  border-radius: 1rem;
  cursor: pointer;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
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
  color: #666;
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
