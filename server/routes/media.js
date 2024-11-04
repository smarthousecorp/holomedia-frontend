const express = require("express");
const router = express.Router();
const authenticateToken = require("../module/authJWT");
const db = require("../db/holomedia");

// 결제 상태 확인
const checkPaymentStatus = async (userId, mediaId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM payments WHERE user_id = ? AND media_id = ? AND status = 'completed'";
    db.query(sql, [userId, mediaId], (err, results) => {
      console.log(err, results);
      if (err) reject(err);
      resolve(results.length > 0);
    });
  });
};

// 랜덤 영상 3개 조회
router.get("/recommend", (req, res) => {
  const sql =
    "SELECT id, title, views, non_thumbnail, member_thumbnail, name FROM medias ORDER BY RAND() LIMIT 3";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("랜덤 영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }
    res.send(results);
  });
});

// 글 전체 조회
router.get("/", (req, res) => {
  const sql =
    "SELECT id, title, views, non_thumbnail, member_thumbnail, name FROM medias ORDER BY id";
  const sqlUpdateViews = "UPDATE medias SET views = views + 1 WHERE id = ?";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("전체 영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }
    res.send(results);
  });
});

// 글 단일 조회 및 조회수 증가 (결제 상태 확인 추가)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // JWT 토큰에서 추출한 사용자 ID
    const mediaId = req.params.id;

    // 미디어 정보 조회
    const sqlSelect = "SELECT * FROM medias WHERE id = ?";
    db.query(sqlSelect, [mediaId], async (err, results) => {
      if (err) {
        console.error("영상 조회 실패:", err);
        return res.status(500).send({message: "서버 오류가 발생했습니다."});
      }

      if (results.length === 0) {
        return res.status(404).send({message: "존재하지 않는 영상입니다."});
      }

      const media = results[0];
      // 결제 여부 반환함수
      const isPaid = await checkPaymentStatus(userId, mediaId);

      // 결제가 필요한 영상이고 결제하지 않은 경우
      if (media.price > 0 && !isPaid) {
        return res.status(403).send({
          message: "결제가 필요한 영상입니다.",
          requirePayment: true,
          price: media.price,
        });
      }

      // 조회수 증가
      const sqlUpdateViews = "UPDATE medias SET views = views + 1 WHERE id = ?";
      db.query(sqlUpdateViews, [mediaId], (err) => {
        if (err) {
          console.error("조회수 업데이트 실패:", err);
          return res.status(500).send({message: "서버 오류가 발생했습니다."});
        }
        res.send({...media, isPaid});
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({message: "서버 오류가 발생했습니다."});
  }
});

// 결제 생성 API
router.post("/:id/payment", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const mediaId = req.params.id;

  try {
    // 이미 결제했는지 확인
    const isPaid = await checkPaymentStatus(userId, mediaId);
    if (isPaid) {
      return res.status(400).send({message: "이미 결제한 영상입니다."});
    }

    // 결제 처리를 해야함

    // 결제 정보 저장
    const sql =
      "INSERT INTO payments (user_id, media_id, amount, status) VALUES (?, ?, ?, 'completed')";
    db.query(sql, [userId, mediaId, req.body.amount], (err, result) => {
      if (err) {
        console.error("결제 실패:", err);
        return res.status(500).send({message: "결제에 실패했습니다."});
      }
      res.send({message: "결제가 완료되었습니다.", paymentId: result.insertId});
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({message: "서버 오류가 발생했습니다."});
  }
});

// 글 등록 API
router.post("/", (req, res) => {
  const {title, url, non_thumbnail, member_thumbnail, name} = req.body;

  // 필수 값 체크
  if (!title || !url || !non_thumbnail || !member_thumbnail || !name) {
    return res.status(400).send({message: "값을 모두 입력해주세요."});
  }

  const sql =
    "INSERT INTO medias (title, url, non_thumbnail, member_thumbnail, name) VALUES (?, ?, ?, ?, ?)";
  const values = [title, url, non_thumbnail, member_thumbnail, name];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("데이터 추가 실패:", err);
      return res.status(500).send({message: "데이터 추가에 실패했습니다."});
    }
    res.send({message: "영상을 등록했습니다.", id: result.insertId});
  });
});

module.exports = router;
