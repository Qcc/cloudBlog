var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
  res.render('error404');
});


module.exports = router;