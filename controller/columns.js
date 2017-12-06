var Columns = require('../models/columns');

module.exports = {
  createColumns:function(req,res,next){
    if(req.body.parent){
      Columns.update({idx:req.body.parent.idx},{$push:{children:req.body.children}},cb);
    }else{
      var columns = new Columns(req.body.children)
      columns.save(cb);
    }
    function cb(err, doc){
      if(err){
        res.send({status:-1, msg:err});
      }else{
        res.send({status: 200, msg: '添加类目成功'})
      }
    }
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
    if(req.body.parent){
      Columns.update({idx: req.body.parent.idx}, {$pull: {children:req.body.children}}, cb)  
    }else{
      Columns.remove({idx: req.body.children.idx,label:req.body.children.label}, cb)              
    }
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