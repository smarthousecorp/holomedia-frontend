export interface Uploader {
  id: number;
  user_id: string;
  username: string;
  created_at: string;
  profile_image: string | null;
  bloom: number;
  media_count: number; // 변경
  total_views: number;
  last_upload: string; // 추가
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
