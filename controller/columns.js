var Columns = require('../models/columns');

module.exports = {
  createColumns:function(req,res,next){
    var columns = new Columns(req.body)
    columns.save(cb);
    function cb(err, doc){
      if(err){
        res.send({status:-1, msg:err});
      }else{
        res.send({status: 200, msg: '添加类目成功', entity: doc})
      }
    }
  },
  updateColumns: function(req, res, next){
    if(req.body.sectionName){
      Columns.update({_id: req.body._id}, {label:req.body.sectionName},cb);
    }else{
      Columns.update(req.body.source._id, {level: req.body.target.level},cb);
      Columns.update(req.body.target._id, {level: req.body.source.level},cb);            
    }
    function cb(err, doc){
      if(err){
        res.send({status:-2, msg:err});
      }else{
        res.send({status: 200, msg: '更新成功'})
      }
    }
  },
  deleteColumns: function(req, res, next){
    Columns.remove({_id: req.body._id}, cb)
    function cb(err, doc){
      if(err){
        res.send({status:-1, msg:err});
      }else{
        res.send({status: 200, msg: '删除类目成功！'})
      }
    }
  },
  queryColumns: function(req, res, next){
    Columns.find().exec(function(err, doc){
      if(err){
        res.send({status:-1, msg:err});
      }else{
        res.send({status: 200, msg: 'ok', entity: doc});
      }
    });
  }
}