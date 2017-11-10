var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
  res.send('这是注册页');
});


module.exports = router;