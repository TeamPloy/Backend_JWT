const express = require("express");
const { validateToken } = require("../middleware/AuthMiddleware"); // 여기 경로는 실제 파일 위치에 맞게 조정해주세요.
const router = express.Router();

// 테스트 API 경로
router.get("/testapi", validateToken, (req, res) => {
  res.json({ message: "성공적으로 인증되었습니다!" });
});

module.exports = router