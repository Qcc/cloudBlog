// 文章管理模块
var Articles = require('../models/article');

module.exports = {
  createArticle: function (req, res, next) {
    req.body.type = 'article';
    req.body.view = Math.ceil(Math.random() * 2345 + 234);
    req.body.like = Math.ceil(Math.random() * 234 + 34);
    console.log(req.body)
    var article = new Articles(req.body);
    article.save(cb);
    function cb(err, doc){
      if(err){
        return res.send({status:-1, msg:err});
      }else{
        return res.send({status: 200, msg: '添加文章成功', entity: doc})
      }
    }
  },
  updateArticle:function (req, res, next) {
    
  },
  queryArticle:function (req, res, next) {
    
  },
  deleteArticle:function (req, res, next) {
    
  }
}