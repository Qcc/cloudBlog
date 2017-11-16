var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
  res.send({
    status: 1,
    image_path:'path/sdf',
    msg: '反倒是发射的发'
  })
  // res.render('edit');
});


module.exports = router;