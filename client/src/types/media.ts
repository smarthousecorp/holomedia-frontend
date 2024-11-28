// 영상 단일 데이터 타입
export interface media {
  id: number;
  title: string;
  url: string;
  views: number;
  thumbnail: string;
  name: string;
  created_date: Date;
  price: number;
  uploader_id: number;
  description: string;
  like_count: number;
  is_liked: boolean;
}

export interface weeklyMedia {
  id: number;
  title: string;
  // url: string;
  total_views: number;
  weekly_views: number;
  view_status: string;
  thumbnail: string;
  name: string;
  created_date: string;
  price: number;
  uploader_id: number;
  description: string;
  // updatedAt: Date;
}
