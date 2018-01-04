// 文章管理模块
var Articles = require('../models/article');

module.exports = {
  createArticle: function (req, res, next) {
    req.body.type = 'article';
    req.body.view = Math.ceil(Math.random() * 2345 + 134);
    req.body.like = Math.ceil(Math.random() * 234 + 14);
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
    var params = {};
    if(req.params === null){
      params.type = req.column;
    }
    Articles.find(params, function(err,doc){
      if(err){
        return res.send({status: -1, msg: '数据库查询错误'});
      }
      return res.send({status: 200, entity: doc});
    }).sort({_id:-1}).limit(10);;
  },
  deleteArticle:function (req, res, next) {
    console.log('params ', req.body);
    Articles.remove({_id: req.body.id}, function(err, doc){
      if(err){
        return res.send({status: -1, msg: '数据库错误,未删除'});        
      }
      return res.send({status: 200, msg: '文章已删除'});              
    })
  }
}