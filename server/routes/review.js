// 체험단 cafe24 + nodejs 연동 테스트 router
const express = require("express");
const router = express.Router();
const reviewService = require("../module/review");

// 신청 현황 조회
router.get("/review-status/:productId", async (req, res) => {
  try {
    const status = await reviewService.getReviewStatus(req.params.productId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 체험단 신청
router.post("/apply", async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const result = await reviewService.applyForReview(productId, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 신청 취소
router.post("/cancel", async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const result = await reviewService.cancelApplication(userId, productId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
