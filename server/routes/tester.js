// 체험단 cafe24 + nodejs 연동 테스트 router
const express = require("express");
const router = express.Router();
const db = require("../db/holomedia");

// 신청 현황 조회 API
router.get("/api/review-status/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const status = await db.findOne({
      where: { product_id: productId },
    });
    res.json({
      totalSpots: status.total_spots,
      currentApplications: status.current_applications,
      isOpen: status.status === "OPEN",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
