var express = require('express');
var router = express.Router();
var Columns = require('../../controller/columns');
var Upload = require('../../controller/upload');
var Articles = require('../../controller/articles');

// 跨域访问设置
//allow custom header and CORS
router.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
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
  Columns.createColumns(req, res, next);
});
router.delete('/section.api',function(req,res,next){
  Columns.deleteColumns (req, res, next);
});
router.put('/section.api',function(req,res,next){
  Columns.updateColumns(req, res, next);
});
router.get('/section.api',function(req,res,next){
  Columns.queryColumns(req, res, next);
});

// 文件上传
router.post('/upload.api',Upload.uploadImg,function(req,res,next){
  Upload.upload(req, res, next);
});
// 获取文章
router.get('/article.api',function(req,res,next){
  console.log('router ',req.body)
  Articles.queryArticle(req, res, next);
});
// 发表文章
router.post('/article.api',function(req,res,next){
  console.log('router ',req.body)
  Articles.createArticle(req, res, next);
});
// 修改文章
router.put('/article.api',function(req,res,next){
  console.log('router ',req.body)
  Articles.createArticle(req, res, next);
});
// 删除文章
router.delete('/article.api',function(req,res,next){
  console.log('router ',req.body)
  Articles.deleteArticle(req, res, next);
});
router.all('*',function(req,res,next){
  res.send({status: 404, msg: "can't found!"});
});

module.exports = router;