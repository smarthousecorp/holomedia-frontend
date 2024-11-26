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
      if (err) reject(err);
      resolve(results.length > 0);
    });
  });
};

// 업로더 목록 조회 API
router.get("/uploaders", (req, res) => {
  const sql = `
    SELECT DISTINCT name 
    FROM medias 
    ORDER BY name`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("업로더 목록 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }

    // 이름만 추출하여 배열로 변환
    const uploaders = results.map((row) => row.name);

    res.send({
      status: "success",
      data: uploaders, // ["미주", "수민", "채희", "민지"] 형태로 반환됨
    });
  });
});

// 최근 생성된 영상 조회 (limit 파라미터 지원)
router.get("/recent", (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // 기본값 10
  const maxLimit = 50; // 최대 조회 가능한 개수

  // limit 값 검증
  if (limit <= 0 || limit > maxLimit) {
    return res.status(400).send({
      message: `조회 개수는 1에서 ${maxLimit} 사이여야 합니다.`,
    });
  }

  const sql = `
    SELECT 
      id, 
      title, 
      views, 
      thumbnail,
      name,
      price,
      uploader_id,
      description,
      like_count,
      DATE_FORMAT(created_at, '%Y-%m-%d') as created_date
    FROM medias 
    ORDER BY created_at DESC 
    LIMIT ?`;

  db.query(sql, [limit], (err, results) => {
    if (err) {
      console.error("최근 영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }

    // if (results.length === 0) {
    //   return res.status(204).send({
    //     status: "empty",
    //     message: "등록된 영상이 없습니다.",
    //   });
    // }

    res.send({
      status: "success",
      data: results,
    });
  });
});

// 실시간 베스트 영상 조회 (limit 파라미터 지원) 추후에는 일간, 주간, 월간 베스트로 변경 예정
router.get("/best", (req, res) => {
  const limit = parseInt(req.query.limit) || 12; // 기본값 10
  const maxLimit = 50; // 최대 조회 가능한 개수

  // limit 값 검증
  if (limit <= 0 || limit > maxLimit) {
    return res.status(400).send({
      message: `조회 개수는 1에서 ${maxLimit} 사이여야 합니다.`,
    });
  }

  const sql = `
    SELECT 
      id, 
      title, 
      views, 
      thumbnail,
      name,
      price,
      uploader_id,
      description,
      like_count,
      DATE_FORMAT(created_at, '%Y-%m-%d') as created_date
    FROM medias 
    ORDER BY views DESC, created_at DESC 
    LIMIT ?`;

  db.query(sql, [limit], (err, results) => {
    if (err) {
      console.error("실시간 베스트 영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }

    if (results.length === 0) {
      return res.status(404).send({
        status: "empty",
        message: "등록된 영상이 없습니다.",
      });
    }

    res.send({
      status: "success",
      data: results,
    });
  });
});

// 주간 통계 API
router.get("/weekly/:name", authenticateToken, (req, res) => {
  const creatorName = req.params.name;

  // 1. 크리에이터의 모든 영상을 조회하는 쿼리
  const sql = `
    SELECT 
      m.id,
      m.name,
      m.title,
      m.views as total_views,
      thumbnail,
      m.price,         /* Price 필드 추가 */
      m.uploader_id,
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
      END DESC`;

  db.query(sql, [creatorName], (err, results) => {
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

// 랜덤 영상 3개 조회
router.get("/recommend", authenticateToken, (req, res) => {
  const sql =
    "SELECT id, title, views, thumbnail, name FROM medias ORDER BY RAND() LIMIT 3";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("랜덤 영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }
    res.send(results);
  });
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

// 로그 기록 함수
const logVideoView = (mediaId, userId) => {
  const sql = `INSERT INTO view_logs (media_id, users_id) VALUES (?, ?)`;

  db.query(sql, [mediaId, userId], (err, result) => {
    if (err) {
      console.error("조회 로그 기록 실패:", err);
      // 에러가 발생해도 사용자 경험에 영향을 주지 않도록 처리
      return;
    }
    console.log(`조회 기록 완료, mediaId : ${mediaId}, userId : ${userId}`);
  });
};

// 글 전체 조회
router.get("/", (req, res) => {
  const sql =
    "SELECT id, title, views, thumbnail, name FROM medias ORDER BY id";

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
    const id = req.user.id;
    const userId = req.user.user_id;
    const mediaId = req.params.id;

    // 사용자 정보 조회 (어드민 여부 확인)
    const userSql = "SELECT is_admin FROM users WHERE user_id = ?";
    db.query(userSql, [userId], async (userErr, userResults) => {
      if (userErr) {
        console.error("사용자 정보 조회 실패:", userErr);
        return res.status(500).send({message: "서버 오류가 발생했습니다."});
      }

      const isAdmin = userResults[0]?.is_admin || false;

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

        // 어드민이 아닌 경우에만 결제 상태 확인
        const isPaid = isAdmin ? true : await checkPaymentStatus(id, mediaId);

        // 어드민이 아니고, 결제가 필요한 영상이며 결제하지 않은 경우
        if (!isAdmin && media.price > 0 && !isPaid) {
          return res.status(403).send({
            message: "결제가 필요한 영상입니다.",
            requirePayment: true,
            price: media.price,
          });
        }

        // 조회수 증가
        const sqlUpdateViews =
          "UPDATE medias SET views = views + 1 WHERE id = ?";
        db.query(sqlUpdateViews, [mediaId], (err) => {
          if (err) {
            console.error("조회수 업데이트 실패:", err);
            return res.status(500).send({message: "서버 오류가 발생했습니다."});
          }

          // 조회 로그 기록
          logVideoView(mediaId, id);

          res.send({...media, isPaid});
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({message: "서버 오류가 발생했습니다."});
  }
});

// 영상 등록 API 수정 (업로더 정보 추가)
router.post("/", authenticateToken, (req, res) => {
  const {title, url, thumbnail, name} = req.body;
  const uploader_id = req.user.id; // JWT 토큰에서 사용자 ID 추출
  console.log(req.user);

  // 필수 값 체크
  if (!title || !url || !thumbnail || !name) {
    return res.status(400).send({message: "값을 모두 입력해주세요."});
  }

  const sql =
    "INSERT INTO medias (title, url, thumbnail, name, uploader_id) VALUES (?, ?, ?, ?, ?)";
  const values = [title, url, thumbnail, name, uploader_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("데이터 추가 실패:", err);
      return res.status(500).send({message: "데이터 추가에 실패했습니다."});
    }
    res.send({message: "영상을 등록했습니다.", id: result.insertId});
  });
});

module.exports = router;
