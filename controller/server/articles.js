// 文章管理模块
var Articles = require('../../models/article');
var Columns = require('../../models/columns');
var Parallel = require('async/parallel');

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
    console.log('req.body ', req.body)
    Articles.update({_id: req.body._id}, req.body, function(err, doc){
      if(err){
        console.log(err)
        return res.send({status: -1, msg: '数据库错误'});
      }
      return res.send({status: 200, entity: doc})
    })
  },
  queryArticle:function (req, res, next) {
    var params = {};
    if(req.query.column === undefined){
      params.type = req.query.column;
    }
    var page = +req.query.currentPage;
    var limit = +req.query.limit;
    Parallel({
      columns: function(callback) {
        Columns.find({},function(err, column){
          callback(err, column);
        });
      },
      articles: function(callback) {
        Articles.find({}, function(err,doc){
          callback(err, doc);
        }).sort({_id:-1}).limit(limit).skip(page * limit);;
      },
      articlesCount: function(callback) {
        Articles.count({}, function(err,doc){
          callback(err, doc);
        });
      }
    },
    function(err, results) {
      if(err){
        console.log(err)
        return res.send({status: -1, msg: '数据库错误'});
      }
      return res.send({status: 200, entity: results})
    });
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