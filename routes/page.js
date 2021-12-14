const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

// 로그인한 상태
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});
// 로그아웃한 상태
router.get('/account', isNotLoggedIn, (req, res) => {
  res.render('account', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('home', {
    title: 'NodeBird',
    twits,
  });
});

module.exports = router;