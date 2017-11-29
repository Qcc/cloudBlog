var express = require('express');
var router = express.Router();

router.get('/overview.html',function(req,res,next){
  res.render('./server/overview');
});
router.get('/section.html',function(req,res,next){
  res.render('./server/section');
});
router.get('/pusharticle.html',function(req,res,next){
  res.render('./server/pusharticle');
});
router.get('/articlemanage.html',function(req,res,next){
  res.render('./server/articlemanage');
});
router.get('/pushpicture.html',function(req,res,next){
  res.render('./server/pushpicture');
});
router.get('/picturemanage.html',function(req,res,next){
  res.render('./server/picturemanage');
});


module.exports = router;