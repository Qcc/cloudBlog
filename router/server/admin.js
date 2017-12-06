var express = require('express');
var router = express.Router();
var Columns = require('../../controller/columns');
// 跨域访问设置
//allow custom header and CORS
router.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', 'true');  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200); // 让options请求快速返回
  }
  else {
    next();
  }
});
router.post('/section.api',function(req,res,next){
  console.log('req.body', req.body)
  Columns.createColumns(req, res, next);
});
router.delete('/section.api',function(req,res,next){
  console.log('req.body', req.body)  
  Columns.deleteColumns (req, res, next);
});
router.put('/section.api',function(req,res,next){
  Columns.updateColumns(req, res, next);
});
router.get('/section.api',function(req,res,next){
  Columns.queryColumns(req, res, next);
});


module.exports = router;