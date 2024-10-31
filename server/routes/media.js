const express = require("express");
const router = express.Router();

const medias = {
  data: [
    {
      id: 1,
      title: "첫 번째 영상",
      url: "../db/videos/media_sample1.mp4",
      views: 120,
      thumbnail: "../db/image/media_thumbnail1.png",
      name: "지민",
    },
    {
      id: 2,
      title: "두 번째 영상",
      url: "../db/videos/media_sample2.mp4",
      views: 950,
      thumbnail: "../db/image/media_thumbnail2.png",
      name: "수아",
    },
    {
      id: 3,
      title: "세 번째 영상",
      url: "../db/videos/media_sample3.mp4",
      views: 150,
      thumbnail: "../db/image/media_thumbnail3.png",
      name: "하늘",
    },
    {
      id: 4,
      title: "네 번째 영상",
      url: "../db/videos/media_sample4.mp4",
      views: 1800,
      thumbnail: "../db/image/media_thumbnail4.png",
      name: "민서",
    },
    {
      id: 5,
      title: "다섯 번째 영상",
      url: "../db/videos/media_sample5.mp4",
      views: 200,
      thumbnail: "../db/image/media_thumbnail5.png",
      name: "유진",
    },
    {
      id: 6,
      title: "여섯 번째 영상",
      url: "../db/videos/media_sample6.mp4",
      views: 60,
      thumbnail: "../db/image/media_thumbnail6.png",
      name: "소희",
    },
    {
      id: 7,
      title: "일곱 번째 영상",
      url: "../db/videos/media_sample7.mp4",
      views: 110,
      thumbnail: "../db/image/media_thumbnail7.png",
      name: "예린",
    },
    {
      id: 8,
      title: "여덟 번째 영상",
      url: "../db/videos/media_sample8.mp4",
      views: 75,
      thumbnail: "../db/image/media_thumbnail8.png",
      name: "지아",
    },
    {
      id: 9,
      title: "아홉 번째 영상",
      url: "../db/videos/media_sample9.mp4",
      views: 130,
      thumbnail: "../db/image/media_thumbnail9.png",
      name: "채원",
    },
    {
      id: 10,
      title: "열 번째 영상",
      url: "../db/videos/media_sample10.mp4",
      views: 90,
      thumbnail: "../db/image/media_thumbnail10.png",
      name: "나은",
    },
  ],
  id: 11, // 다음 ID는 4로 설정
};

// 글 전체 조회
router.get("/", (req, res) => {
  res.send(medias.data);
});

// 글 단일 조회
router.get("/:id", (req, res) => {
  const media = medias.data.find(
    (media) => media.id === parseInt(req.params.id)
  );
  if (!media) {
    res.status(404).send({message: "존재하지 않는 영상입니다."});
    return;
  }
  res.send(media);
});

// 글 등록
router.post("/", (req, res) => {
  const {title, url} = req.body;

  if (!title || !url) {
    res.status(400).send({message: "title, url은 필수 입력 사항입니다."});
    return;
  }
  // 글 추가
  medias.data.push({
    ...req.body,
    id: medias.id, // 수정된 부분
  });
  medias.id++; // 수정된 부분
  res.send({message: "영상을 등록했습니다."});
});

module.exports = router;
