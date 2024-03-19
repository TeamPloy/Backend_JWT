const express = require("express");
const { validateToken } = require("../middleware/AuthMiddleware"); 
const router = express.Router();

// 테스트 API 경로
router.get("/testapi", validateToken, (req, res) => {
  res.json({ message: "성공적으로 인증되었습니다!" });
});

module.exports = router