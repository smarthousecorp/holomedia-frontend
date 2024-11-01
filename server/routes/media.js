const express = require("express");
const router = express.Router();
const authenticateToken = require("../module/authJWT");

const medias = {
  data: [
    {
      id: 1,
      title: "첫 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 120,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail.png?alt=media&token=5f87d74e-9919-4381-87c3-4b0d5e4f1218",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "지민",
    },
    {
      id: 2,
      title: "두 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 950,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail2.png?alt=media&token=9f3fdb0f-7256-4390-b40b-c6dd7314ee41",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail2.png?alt=media&token=124cc286-0084-412b-98c8-02961a66e9a2",
      name: "수아",
    },
    {
      id: 3,
      title: "세 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 150,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail3.png?alt=media&token=c977b3e8-bfb1-4b3e-9cce-939021a47b3a",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail3.png?alt=media&token=2ba1821c-4f01-4467-bac6-0ec437bfea24",
      name: "하늘",
    },
    {
      id: 4,
      title: "네 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 1800,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail4.png?alt=media&token=3a2ca5ee-0ffe-4961-b9b1-4ecf7776bcb7",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "민서",
    },
    {
      id: 5,
      title: "다섯 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 200,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail5.png?alt=media&token=8b593bdd-a9dc-4bed-9dc9-a6e64ad089f0",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "유진",
    },
    {
      id: 6,
      title: "여섯 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 60,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail6.png?alt=media&token=d8daf9e8-fff4-4b6d-ad51-25b7ec43b7b2",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "소희",
    },
    {
      id: 7,
      title: "일곱 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 110,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail7.png?alt=media&token=8f9c2698-12f2-44b4-a018-498ebab031e5",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "예린",
    },
    {
      id: 8,
      title: "여덟 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 75,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail8.png?alt=media&token=710d6807-dff2-494d-aaed-401db1bf4953",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "지아",
    },
    {
      id: 9,
      title: "아홉 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 130,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail.png?alt=media&token=5f87d74e-9919-4381-87c3-4b0d5e4f1218",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "채원",
    },
    {
      id: 10,
      title: "열 번째 영상",
      url: "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Ftest.mp4?alt=media&token=c6892120-2ad6-4109-ad8e-feeed87bbc07",
      views: 90,
      non_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fthumbnail.png?alt=media&token=5f87d74e-9919-4381-87c3-4b0d5e4f1218",
      member_thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/quill-image-store.appspot.com/o/video%2Fmember_thumbnail.png?alt=media&token=e243a3d0-cbad-4205-96ff-5519e9a3eb29",
      name: "나은",
    },
  ],

  id: 11, // 다음 ID는 4로 설정
};

// 랜덤 영상 3개 조회
router.get("/recommend", (req, res) => {
  const shuffled = medias.data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  res.send(selected);
});

// 글 전체 조회
router.get("/", (req, res) => {
  // url은 제외하고 전송 (브라우저를 통한 영상 탈취 방지)
  const sortedMedias = medias.data
    .map(({url, ...rest}) => rest)
    .sort((a, b) => a.id - b.id);
  res.send(sortedMedias);
});

// 글 단일 조회
router.get("/:id", authenticateToken, (req, res) => {
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
