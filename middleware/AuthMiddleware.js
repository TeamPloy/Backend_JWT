const { verify, sign } = require('jsonwebtoken');
const ACCESSERECT = 'accessserect'; 
const REFRESHSECRET = 'refreshsecret'; 

const validateToken = (req, res, next) => {
  const accessToken = req.header('accessToken');
  const refreshToken = req.header('refreshToken');

  if (!accessToken) return res.json({ error: '로그인 상태가 아닙니다.' });

  try {
    const comfireToken = verify(accessToken, ACCESSERECT);
    req.user = comfireToken;
    if (comfireToken) {
      return next();
    }
  } catch (err) {
    // accessToken이 만료된 경우
    if (err.name === 'TokenExpiredError') {
      // refreshToken도 없는 경우
      if (!refreshToken) return res.json({ error: '재로그인이 필요합니다.' }); 

      try {
        const validRefreshToken = verify(refreshToken, REFRESHSECRET); // refreshToken 검증
        if (validRefreshToken) {
          // refreshToken이 유효한 경우 accessToken 재발급
          const newAccessToken = sign({ user: validRefreshToken.user }, ACCESSERECT, { expiresIn: '1d' });
          res.header('accessToken', newAccessToken); // 새로운 accessToken 설정
          req.user = validRefreshToken;
          return next();
        }
      } catch (refreshErr) {
        // refreshToken 만료
        return res.json({ error: '로그아웃 되었습니다.' });
      }
    } else {
      // accessToken 검증 중 다른 오류 발생
      return res.json({ error: err.message });
    }햣
  }
};

module.exports = { validateToken };
