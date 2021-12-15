const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, Img } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      // 파일 이름이 겹치지 않도록 처리
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
// 사진 여러장
// 출처: https://likebubbletea.tistory.com/53
router.post('/img', isLoggedIn, upload.array('img', 5), (req, res) => {
  console.log(req.files);
  let urlArr = new Array();
  for(let i = 0; i < req.files.length; i++){
    console.log(req.files[i].filename);
    urlArr.push(`/img/${req.files[i].filename}`);
    console.log(urlArr[i]);
  }
  let jsonUrl = JSON.stringify(urlArr);
  res.json(jsonUrl);
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.array('img', 5), async (req, res, next) => {
    console.log(req.user);
    console.log("content========" + req.body.content);
    console.log("urllllll=" + req.body.url);
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;