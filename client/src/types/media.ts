// 영상 단일 데이터 타입
export interface media {
  id: number;
  title: string;
  url: string;
  views: number;
  non_thumbnail: string;
  member_thumbnail: string;
  name: string;
  created_date: Date;
  price: number;
}

export interface weeklyMedia {
  id: number;
  title: string;
  // url: string;
  total_views: number;
  weekly_views: number;
  view_status: string;
  non_thumbnail: string;
  member_thumbnail: string;
  name: string;
  created_date: string;
  price: number;
  // updatedAt: Date;
}
