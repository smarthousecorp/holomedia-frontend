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
router.get("/recommend", authenticateToken, (req, res) => {
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

// 주간 통계 API
router.get("/weekly/:name", (req, res) => {
  const creatorName = req.params.name;

  // 1. 크리에이터의 모든 영상을 조회하는 쿼리
  const sql = `
    SELECT 
      m.id,
      m.name,
      m.title,
      m.views as total_views,
      m.non_thumbnail,
      m.member_thumbnail,
      COALESCE(weekly_views.view_count, 0) as weekly_views,
      DATE_FORMAT(m.created_at, '%Y-%m-%d') as created_date,
      CASE 
        WHEN m.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'new'
        WHEN m.created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'old'
        ELSE 'regular'
      END as content_age_status
    FROM 
      medias m
    LEFT JOIN (
      SELECT 
        media_id,
        COUNT(*) as view_count
      FROM 
        view_logs
      WHERE 
        viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND viewed_at <= NOW()
      GROUP BY 
        media_id
    ) weekly_views ON m.id = weekly_views.media_id
    WHERE 
      m.name = ?
    ORDER BY 
      CASE 
        WHEN weekly_views.view_count IS NOT NULL AND weekly_views.view_count > 0 
        THEN weekly_views.view_count 
        ELSE m.views 
      END DESC`; // weekly_views가 없으면 전체 views로 정렬

  db.query(sql, [creatorName], (err, results) => {
    console.log(results);

    if (err) {
      console.error("크리에이터 주간 통계 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }

    // 2. 크리에이터가 존재하지 않는 경우
    if (results.length === 0) {
      return res.status(404).send({
        status: "empty",
        message: "해당 크리에이터의 데이터가 없습니다.",
      });
    }

    // 3. 통계 요약 정보
    const summary = {
      total_contents: results.length,
      total_weekly_views: results.reduce(
        (sum, item) => sum + item.weekly_views,
        0
      ),
      total_views: results.reduce((sum, item) => sum + item.total_views, 0),
      contents_with_no_weekly_views: results.filter(
        (item) => item.weekly_views === 0
      ).length,
      new_contents: results.filter((item) => item.content_age_status === "new")
        .length,
      has_weekly_data: results.some((item) => item.weekly_views > 0),
    };

    res.send({
      status: "success",
      summary,
      data: results.map(({content_age_status, ...item}) => ({
        ...item,
        view_status: item.weekly_views > 0 ? "active" : "inactive",
      })),
    });
  });
});

// 조회수 로그를 기록하기 위한 함수 추가 (기존 조회수 증가 로직에 추가)
const logVideoView = (mediaId, userId = null) => {
  const sql =
    "INSERT INTO view_logs (media_id, user_id, viewed_at) VALUES (?, ?, NOW())";
  db.query(sql, [mediaId, userId], (err) => {
    if (err) {
      console.error("조회수 로그 기록 실패:", err);
    }
  });
};

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

        // 조회 로그 기록
        logVideoView(mediaId, userId);

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
