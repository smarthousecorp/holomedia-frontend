// 영상 단일 데이터 타입
export interface media {
  id: number;
  title: string;
  url: string;
  views: number;
  non_thumbnail: string;
  member_thumbnail: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
}
