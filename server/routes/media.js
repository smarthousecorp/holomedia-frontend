const express = require("express");
const router = express.Router();

const medias = {
  data: [
    {
      id: 1,
      title: "첫 번째 영상",
      url: "http://example.com/video1",
      views: 120,
      thumbnail: "http://example.com/thumbnail1.jpg",
      name: "지민",
    },
    {
      id: 2,
      title: "두 번째 영상",
      url: "http://example.com/video2",
      views: 950,
      thumbnail: "http://example.com/thumbnail2.jpg",
      name: "수아",
    },
    {
      id: 3,
      title: "세 번째 영상",
      url: "http://example.com/video3",
      views: 150,
      thumbnail: "http://example.com/thumbnail3.jpg",
      name: "하늘",
    },
    {
      id: 4,
      title: "네 번째 영상",
      url: "http://example.com/video4",
      views: 1800,
      thumbnail: "http://example.com/thumbnail4.jpg",
      name: "민서",
    },
    {
      id: 5,
      title: "다섯 번째 영상",
      url: "http://example.com/video5",
      views: 200,
      thumbnail: "http://example.com/thumbnail5.jpg",
      name: "유진",
    },
    {
      id: 6,
      title: "여섯 번째 영상",
      url: "http://example.com/video6",
      views: 60,
      thumbnail: "http://example.com/thumbnail6.jpg",
      name: "소희",
    },
    {
      id: 7,
      title: "일곱 번째 영상",
      url: "http://example.com/video7",
      views: 110,
      thumbnail: "http://example.com/thumbnail7.jpg",
      name: "예린",
    },
    {
      id: 8,
      title: "여덟 번째 영상",
      url: "http://example.com/video8",
      views: 75,
      thumbnail: "http://example.com/thumbnail8.jpg",
      name: "지아",
    },
    {
      id: 9,
      title: "아홉 번째 영상",
      url: "http://example.com/video9",
      views: 130,
      thumbnail: "http://example.com/thumbnail9.jpg",
      name: "채원",
    },
    {
      id: 10,
      title: "열 번째 영상",
      url: "http://example.com/video10",
      views: 90,
      thumbnail: "http://example.com/thumbnail10.jpg",
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
