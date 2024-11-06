// routes/niceAuthRoute.js
const express = require("express");
const router = express.Router();
const niceAuthController = require("../controllers/niceAuthController");

router.post("/request", niceAuthController.requestAuth);
router.post("/verify", niceAuthController.verifyAuth);

module.exports = router;
