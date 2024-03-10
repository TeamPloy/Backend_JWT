const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const {Id, name, password} = req.body;
    const overlapId = await User.findOne({ where: {Id}});
    const overlapName = await User.findOne({ where: {name}});
    
    if (overlapId) { // ID 중복확인
      return res.status(400).send({ message: '이미 사용중인 ID입니다' });
    }

    if (overlapName) { // 이름 중복확인
      return res.status(400).send({ message: '이미 사용중인 이름입니다' });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    
    const user = await User.create({Id, name, password: hashPassword});
    res.status(201).json({ message: '회원가입 완료'});

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '회원가입 오류'});
  }
});

// 로그인
router.post('/signin', async (req, res) => {
  try {
    const {Id, password} = req.body;
    const user = await User.findOne({where: {Id}});
    if (!user) { // 존재하는 유저인지 확인
      return res.status(400).send({ message: '존재하지 않는 ID입니다'});
    }
    
    const confirmPassword = await bcrypt.compare(password, user.password);
    
    if (!confirmPassword) {
      return res.status(400).send({ message: '비밀번호가 일치하지 않습니다 '});
    }

    const accessToken = sign({ Id: user.Id, name: user.name}, 'importantsecret');

    res.status(200).json({ message: '로그인 완료', accessToken: accessToken});

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '로그인 중 오류 발생'});
  }
});

module.exports = router;
