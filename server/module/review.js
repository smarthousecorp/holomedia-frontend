const db = require("../db/holomedia");

// 체험단 신청 현황 조회
const getReviewStatus = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT total_spots, current_applications, status 
        FROM review_applications
        WHERE product_id = ?`;

    db.query(sql, [productId], (err, results) => {
      if (err) reject(err);
      resolve(results[0]);
    });
  });
};

// 체험단 신청
const applyForReview = (productId, userId) => {
  return new Promise((resolve, reject) => {
    // 트랜잭션 시작
    db.beginTransaction((err) => {
      if (err) reject(err);

      // 1. 현재 모집 상태 확인
      const checkSql = `
          SELECT id, total_spots, current_applications, status 
          FROM review_applications 
          WHERE product_id = ? AND status = 'OPEN'
          FOR UPDATE`;

      db.query(checkSql, [productId], (err, results) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        const reviewApp = results[0];
        if (
          !reviewApp ||
          reviewApp.current_applications >= reviewApp.total_spots
        ) {
          return db.rollback(() => reject(new Error("신청이 마감되었습니다.")));
        }

        // 2. 중복 신청 확인
        const checkDuplicateSql = `
            SELECT id FROM applications 
            WHERE review_application_id = ? AND user_id = ?`;

        db.query(
          checkDuplicateSql,
          [reviewApp.id, userId],
          (err, dupResults) => {
            if (err) {
              return db.rollback(() => reject(err));
            }

            if (dupResults.length > 0) {
              return db.rollback(() =>
                reject(new Error("이미 신청하셨습니다."))
              );
            }

            // 3. 신청 처리
            const insertSql = `
              INSERT INTO applications (review_application_id, user_id, status) 
              VALUES (?, ?, 'PENDING')`;

            db.query(insertSql, [reviewApp.id, userId], (err, insertResult) => {
              if (err) {
                return db.rollback(() => reject(err));
              }

              // 4. 신청 현황 업데이트
              const updateSql = `
                UPDATE review_applications 
                SET current_applications = current_applications + 1 
                WHERE id = ?`;

              db.query(updateSql, [reviewApp.id], (err, updateResult) => {
                if (err) {
                  return db.rollback(() => reject(err));
                }

                // 트랜잭션 완료
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => reject(err));
                  }
                  resolve({
                    success: true,
                    applicationId: insertResult.insertId,
                  });
                });
              });
            });
          }
        );
      });
    });
  });
};

// 신청 취소
const cancelApplication = (userId, productId) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) reject(err);

      const sql = `
          UPDATE applications a
          JOIN review_applications ra ON a.review_application_id = ra.id
          SET a.status = 'CANCELED',
              ra.current_applications = ra.current_applications - 1
          WHERE ra.product_id = ? 
          AND a.user_id = ? 
          AND a.status = 'PENDING'`;

      db.query(sql, [productId, userId], (err, result) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        if (result.affectedRows === 0) {
          return db.rollback(() =>
            reject(new Error("취소할 신청내역이 없습니다."))
          );
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => reject(err));
          }
          resolve({ success: true });
        });
      });
    });
  });
};

module.exports = {
  getReviewStatus,
  applyForReview,
  cancelApplication,
};
