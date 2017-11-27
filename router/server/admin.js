var express = require('express');
var router = express.Router();

router.get('/login',function(req,res,next){
  res.header("X-Powered-By", 'ASP.NET');
  res.render('./server/login',{title:'个人博客'});
});


module.exports = router;