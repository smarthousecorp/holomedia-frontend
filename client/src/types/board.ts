export interface board {
  boardNo: number;
  creatorNo: number;
  title: string;
  contents: contents;
  point: number;
  paid: boolean;
  loginId: string;
  fileNames: string;
  urls: {
    thumbnail: string;
    video: string;
    image: string;
    highlight: string;
  };
  fileNameList: string[];
}

interface contents {
  image: string;
  video: string;
}
