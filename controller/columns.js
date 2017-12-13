var Columns = require('../models/columns');

module.exports = {
  createColumns:function(req,res,next){
    var columns = new Columns(req.body)
    columns.save(cb);
    function cb(err, doc){
      if(err){
        return res.send({status:-1, msg:err});
      }else{
        return res.send({status: 200, msg: '添加类目成功', entity: doc})
      }
    }
  },
  updateColumns: function(req, res, next){
    if(req.body.sectionName){
      Columns.update({_id: req.body._id}, {label:req.body.sectionName, path: req.body.sectionPath, type: req.body.sectionType},cb);
    }else{
      Columns.update(req.body.source, {level: req.body.target.level},function(err,doc){
        console.log(err)
        if(err) return res.send({status:-2, msg:err});
        Columns.update(req.body.target, {level: req.body.source.level},cb);
      });
    }
    function cb(err, doc){
      if(err){
        return res.send({status:-2, msg:err});
      }else{
        return res.send({status: 200, msg: '更新成功'})
      }
    }
  },
  deleteColumns: function(req, res, next){
    Columns.find({"parent": req.body._id},function(err, doc){
      if(err) return res.send({status:-1, msg:err});
      if(doc.length === 0 ){
        Columns.remove({_id: req.body._id}, cb)
      }else{
        return res.send({status:-1, msg:'类目不为空不允许删除，请先删除子类目。'});
      }
    })
    function cb(err, doc){
      if(err){
        return res.send({status:-1, msg:err});
      }else{
        return res.send({status: 200, msg: '删除成功'})
      }
    }
  },
  queryColumns: function(req, res, next){
    Columns.find().exec(function(err, doc){
      console.log('sql')
      if(err){
        return res.send({status:-1, msg:err});
      }else{
        return res.send({status: 200, msg: 'ok', entity: doc});
      }
    });
  },

  // client 请求
  renderIndex: function(req,res,next){
    Columns.find().exec(function(err, doc){
      if(err) return res.render('error');
      var docment = JSON.parse(JSON.stringify(doc));
      var nav = []
      docment.map(function(value,index,arr){
        if(value.parent === null){
          nav.push(value);
        }
      })
      nav.sort(function(a, b){
        return a.level - b.level
      })
      console.log("nav ", req.baseUrl)
      var activeMenu = req.baseUrl.slice(1);
      console.log("nav ", activeMenu)
      nav.forEach(function(item){
        if(item.type === activeMenu){
          item.activeMenu = activeMenu
        }
      });
      return res.render('./news/index',{nav: nav, title:'个人博客'});
    });
  },
  clientQueryColumn:function(cb){
    Columns.find(function(err, doc){
      cb(err, doc);
    })
  }
}