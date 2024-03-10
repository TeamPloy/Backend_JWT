const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken'); // hearder로 accessToken을 받음

    if (!accessToken) return res.json({ error: '로그인 상태가 아닙니다.' }); // 없으면 err

    try {
        const validToken = verify(accessToken, 'importantsecret'); // 디코딩  
        req.user = validToken // 디코딩 한 값을 req.user에 저장해놓음

        if (validToken) { //디코딩 값이 있을때 => accessToken이 이상하면 디코딩이 안됨
            return next(); //디코딩한 값이 있을때 
        }
    } catch (err) {
        return res.json({ error: err });
    }
};

module.exports = { validateToken };