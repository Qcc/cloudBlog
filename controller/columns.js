var Columns = require('../models/columns');

module.exports = {
  createColumns:function(req,res,next){
    Columns.findByIdAndUpdate({name: 'columns'}, {entity: req.body.entity}, function (err, doc){
      console.log('err,doc', err,doc)
      if(err){
        res.send({status:-1, msg:err});
      }else{
        res.send({status: 200, msg: '创建用户成功'})
      }
    })
  },
  updateColumns: function(req, res, next){
    Columns.findByIdAndUpdate({name: 'columns'}, {entity: req.body.entity}, function (err, doc){
      console.log('err,doc', err,doc)
      if(err){
        res.send({status:-2, msg:err});
      }else{
        res.send({status: 200, msg: '更新成功'})
      }
    })
  },
  deleteColumns: function(req, res, next){
    Columns.findByIdAndUpdate({name: 'columns'}, {entity: req.body.entity}, function (err, doc){
      console.log('err,doc', err,doc)
      if(err){
        res.send({status:-3, msg:err});
      }else{
        res.send({status: 200, msg: '删除成功'})
      }
    })
  },
  queryColumns: function(req, res, next){
    Columns.find({name: 'columns'}).exec(function(err, doc){
      if(err){
        res.send({status:-1, msg:err});
      }else{
        console.log('11111 ',doc)
        if(doc[0] && doc[0].entity) {
          res.send({status: 200, msg: 'ok', entity: doc[0].entity});          
        } else {
          Columns.create({name: 'columns', entity: []}, function(err){
            console.log('err00',err)
          });
          res.send({status: 200, msg: 'initDb', entity: []});
        }
      }
    })
  }

}