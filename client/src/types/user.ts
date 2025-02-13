export interface Uploader {
  id: number;
  user_id: string;
  username: string;
  description: string;
  created_at: string;
  profile_image: string;
  background_image: string;
  bloom: number;
  media_count: number; // 변경
  total_views: number;
  last_upload: string; // 추가
}

export interface Creator {
  no: number;
  loginId: string;
  nickname: string;
  content: string;
  createdAt: string;
  profile: string;
  background: string;
}

export interface UploaderResponse {
  status: "success" | "error";
  data: Uploader[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  message?: string;
}
