export interface media {
  boardNo: number;
  creatorNo: number;
  title: string;
  content: string;
  price: number;
  loginId: string;
  urls: {
    thumbnail: string;
    video: string;
    image: string;
    highlight: string;
  };
}
