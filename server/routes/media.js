const express = require("express");
const router = express.Router();
const authenticateToken = require("../module/authJWT");
const db = require("../db/mediaDB");

// 랜덤 영상 3개 조회
router.get("/recommend", (req, res) => {
  const sql =
    "SELECT id, title, views, non_thumbnail, member_thumbnail, name FROM media ORDER BY RAND() LIMIT 3";

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
    "SELECT id, title, views, non_thumbnail, member_thumbnail, name FROM media ORDER BY id";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("전체 영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }
    res.send(results);
  });
});

// 글 단일 조회
router.get("/:id", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM media WHERE id = ?";

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("영상 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }

    if (results.length === 0) {
      return res.status(404).send({message: "존재하지 않는 영상입니다."});
    }

    res.send(results[0]);
  });
});

// 글 등록 API
router.post("/", (req, res) => {
  const {title, url, non_thumbnail, member_thumbnail, name} = req.body;

  // 필수 값 체크
  if (!title || !url || !non_thumbnail || !member_thumbnail || !name) {
    return res.status(400).send({message: "값을 모두 입력해주세요."});
  }

  const sql =
    "INSERT INTO media (title, url, non_thumbnail, member_thumbnail, name) VALUES (?, ?, ?, ?, ?)";
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
