const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require("dotenv").config();
const SecretKey = SECRET_TOKEN_SECRET;

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const {Id, name, password} = req.body;
    const overlapId = await User.findOne({ where: {Id}})
    const overlapName = await User.findOne({ where: {name}});
    
    if (overlapId) { // ID 중복 확인
      return res.status(400).send({ message: '이미 사용중인 ID입니다' });
    }

    if (overlapName) { // 이름 중복 확인
      return res.status(400).send({ message: '이미 사용중인 이름입니다' });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // refreshToken 생성 (유효 시간: 1달)
    const refreshToken = jwt.sign(
      { userId: Id, userName: name },
      SecretKey,
      { expiresIn: '30d' }
    );
    
    await User.create({Id, name, password: hashPassword, refreshToken});
    res.status(201).json({ message: '회원가입 완료' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '회원가입 오류' });
  }
});

// 로그인
router.post('/signin', async (req, res) => {
  try {
    const { Id, password } = req.body;
    const user = await User.findOne({ where: { Id } });
    if (!user) {
      return res.status(400).send({ message: '존재하지 않는 ID입니다' });
    }

    const confirmPassword = await bcrypt.compare(password, user.password);
    if (!confirmPassword) {
      return res.status(400).send({ message: '비밀번호가 일치하지 않습니다' });
    }

    // refreshToken 검증
    let newAccessToken;
    let newRefreshToken;
    try {
      jwt.verify(user.refreshToken, SecretKey);
      // refreshToken이 유효한 경우
      newAccessToken = jwt.sign( //accessToken 발급
        { userId: user.Id, userName: user.name },
        SecretKey,
        { expiresIn: '1d' }
      );
    } catch (error) { // refreshToken이 유효하지 않은 경우
      newRefreshToken = jwt.sign( //refreshToken 새로 발급
        { userId: user.Id, userName: user.name },
        SecretKey,
        { expiresIn: '10d' }
      );
      newAccessToken = jwt.sign( //accessToken 발급
        { userId: user.Id, userName: user.name },
        SecretKey,
        { expiresIn: '1d' }
      );
      //새로운 refreshToken 저장
      await User.update({ refreshToken: newRefreshToken }, { where: { Id: user.Id } });
    }

    res.status(200).json({
      message: '로그인 완료',
      accessToken: newAccessToken,
      ...(newRefreshToken && { refreshToken: newRefreshToken }),
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '로그인 중 오류 발생' });
  }
});

module.exports = router;
