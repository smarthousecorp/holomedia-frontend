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

router.post("/like/:id", authenticateToken, (req, res) => {
  const mediaId = parseInt(req.params.id);
  const userId = req.user.id;

  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      return res.status(500).send({message: "트랜잭션 시작 실패"});
    }

    // 좋아요 존재 확인과 현재 like_count 조회
    const checkLikeSql = `
      SELECT ml.*, m.like_count 
      FROM media_likes ml
      JOIN medias m ON ml.media_id = m.id
      WHERE ml.media_id = ? AND ml.user_id = ?
    `;

    const getLikeCountSql = `
      SELECT like_count 
      FROM medias 
      WHERE id = ?
    `;

    db.query(checkLikeSql, [mediaId, userId], (checkErr, checkResults) => {
      if (checkErr) {
        return db.rollback(() => {
          res.status(500).send({message: "좋아요 확인 중 오류"});
        });
      }

      if (checkResults.length > 0) {
        // 좋아요 취소
        const unlikeSql = `DELETE FROM media_likes WHERE media_id = ? AND user_id = ?`;
        const updateLikeCountSql = `UPDATE medias SET like_count = GREATEST(0, like_count - 1) WHERE id = ?`;

        db.query(unlikeSql, [mediaId, userId], (unlikeErr) => {
          if (unlikeErr) {
            return db.rollback(() => {
              res.status(500).send({message: "좋아요 취소 실패"});
            });
          }

          db.query(updateLikeCountSql, [mediaId], (updateErr) => {
            if (updateErr) {
              return db.rollback(() => {
                res.status(500).send({message: "좋아요 카운트 업데이트 실패"});
              });
            }

            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  res.status(500).send({message: "트랜잭션 커밋 실패"});
                });
              }

              res.send({
                status: "unliked",
                likeCount: checkResults[0].like_count - 1,
              });
            });
          });
        });
      } else {
        // 좋아요가 없는 경우, 현재 like_count를 조회
        db.query(getLikeCountSql, [mediaId], (countErr, countResults) => {
          if (countErr) {
            return db.rollback(() => {
              res.status(500).send({message: "좋아요 수 조회 실패"});
            });
          }

          const currentLikeCount = countResults[0]?.like_count || 0;

          // 좋아요 추가
          const insertLikeSql = `
            INSERT INTO media_likes (media_id, user_id, created_at) 
            VALUES (?, ?, NOW())
          `;
          const updateLikeCountSql = `UPDATE medias SET like_count = like_count + 1 WHERE id = ?`;

          db.query(insertLikeSql, [mediaId, userId], (insertErr) => {
            if (insertErr) {
              return db.rollback(() => {
                res.status(500).send({message: "좋아요 추가 실패"});
              });
            }

            db.query(updateLikeCountSql, [mediaId], (updateErr) => {
              if (updateErr) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .send({message: "좋아요 카운트 업데이트 실패"});
                });
              }

              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    res.status(500).send({message: "트랜잭션 커밋 실패"});
                  });
                }

                res.send({
                  status: "liked",
                  likeCount: currentLikeCount + 1,
                });
              });
            });
          });
        });
      }
    });
  });
});

// 최근 영상순 조회
// 모든 영상 조회: /recent
// 특정 업로더의 영상 조회: /recent?uploaderId=123
// 페이지 크기 지정: /recent?limit=20
// 둘 다 사용: /recent?uploaderId=123&limit=20
router.get("/recent", authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const maxLimit = 50;
  const userId = req.user?.id;
  const uploaderId = req.query.uploaderId; // 업로더 ID 추가

  if (limit <= 0 || limit > maxLimit) {
    return res.status(400).send({
      message: `조회 개수는 1에서 ${maxLimit} 사이여야 합니다.`,
    });
  }

  // WHERE 절에 업로더 ID 조건 추가
  const uploaderCondition = uploaderId ? "WHERE m.uploader_id = ?" : "";

  // 인증된 사용자인 경우와 아닌 경우의 SQL 분기
  const sql = userId
    ? `
    SELECT 
      m.id, 
      m.title, 
      m.views, 
      m.thumbnail,
      m.name,
      m.price,
      m.uploader_id,
      m.description,
      m.like_count,
      DATE_FORMAT(m.created_at, '%Y-%m-%d') as created_date,
      CASE WHEN ml.user_id IS NOT NULL THEN TRUE ELSE FALSE END as is_liked
    FROM medias m
    LEFT JOIN media_likes ml ON m.id = ml.media_id AND ml.user_id = ?
    ${uploaderCondition}
    ORDER BY m.created_at DESC 
    LIMIT ?
  `
    : `
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
      DATE_FORMAT(created_at, '%Y-%m-%d') as created_date,
      FALSE as is_liked
    FROM medias 
    ${uploaderCondition}
    ORDER BY created_at DESC 
    LIMIT ?
  `;

  // 쿼리 파라미터 배열 구성
  const queryParams = userId
    ? uploaderId
      ? [userId, uploaderId, limit]
      : [userId, limit]
    : uploaderId
    ? [uploaderId, limit]
    : [limit];

  db.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("최근 영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }

    res.send({
      status: "success",
      data: results,
    });
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
  const {title, url, thumbnail, name, description} = req.body;
  const uploader_id = req.user.id; // JWT 토큰에서 사용자 ID 추출

  // 필수 값 체크
  if (!title || !url || !thumbnail || !name) {
    return res.status(400).send({message: "값을 모두 입력해주세요."});
  }

  const sql =
    "INSERT INTO medias (title, url, thumbnail, name, uploader_id, description) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [title, url, thumbnail, name, uploader_id, description];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("데이터 추가 실패:", err);
      return res.status(500).send({message: "데이터 추가에 실패했습니다."});
    }
    res.send({message: "영상을 등록했습니다.", id: result.insertId});
  });
});

module.exports = router;
