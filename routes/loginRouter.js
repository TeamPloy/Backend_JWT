const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

//회원가입
router.post('/signup', async (req, res) => {
  const id = req.body.Id;
  const name = req.body.name;
  const pw = req.body.password;
  const user = await User.findOne({ where: {Id : id}});
  try {
    if (user) { //ID 중복확인
      return res.status(400).send({ message: '이미 존재하는 ID입니다' });
    }
    //
  } catch (error) {
    res.status(200).send({ message : 'err', error});
  }
});

//로그인
router.post('/signin', async (req, res) => {
  const id = req.body.Id;
  const pw = req.body.password;
  const user = await User.findOne({ where: { Id : id }});

  try {
    if (!user) { //존재하는 유저인지 확인
      return res.status(400).send({ message : '존재하지 않는 ID입니다'});
    }
    
    if (bcrypt.compareSync(pw, User.password)){
      // Token 발행

    } else {
      return res.status(400).send({ message : '비밀번호가 일치하지 않습니다'});
    }

  } catch (error) {
    res.status(200).send({ message : 'err', error});
  }
});

module.exports = router;