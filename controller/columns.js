// 网站分组类目管理
var Columns = require('../models/columns');
var Articles = require('../models/article');
var Parallel = require('async/parallel');
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
  
  clientQueryColumn:function(req, res, next){
    Parallel({
      col: function(callback) {
        Columns.find({},function(err, column){
          callback(err, column);
        });
      },
      arti: function(callback) {
        Articles.find({},function(err, article){
          callback(err, article);
        });
      }
    },
    function(err, results) {
      if(err) return res.render('error');
      var col = handleCol(results.col, req.baseUrl.slice(1))
      if(!col){
        next()
      }
      return res.render('./news/index',{nav: col.nav, currentType: col.currentType, index: col.index});    
    });
  }
}

// 解析目录
function handleCol (col, url) {
  var docment = JSON.parse(JSON.stringify(col));
  var activeMenu = url;
  var nav = []
  var index = false;
  var isRouter = false;
  var currentType = {};
  var idnex = false;
  docment.map(function(value,index,arr){
    if(value.parent === null){
      value.children = [];
      if(value.path === activeMenu){
        value.activeMenu = 'active-menu';
        isRouter = true;
        currentType = value;
      }
      nav.push(value);
    }else{
      for (let i = 0; i < nav.length; i++) {
        if(value.parent === nav[i]._id){
          if(value.path === activeMenu){
            value.select = 'subtype-select';
            nav[i].activeMenu = 'active-menu';
            currentType = nav[i];            
            isRouter = true;
          }
          nav[i].children.push(value);
          break;
        }
      }
    }
  })
  nav.sort(function(a, b){
    return a.level - b.level
  })
  for(let j = 0; j < nav.length; j++){
    if(nav[j].length !== 0){
      if(nav[j].path === activeMenu && nav[j].children.length !== 0){
        nav[j].children.unshift({label:'全部', path: nav[j].path, select:'subtype-select'});
      }else if(nav[j].children.length !== 0){
        nav[j].children.unshift({label:'全部', path: nav[j].path});            
      }
      // 菜单序号大于11会显示不出来，与10互换
      if(nav[j].path === activeMenu && j > 10){
        nav.splice(10,0,nav.splice(j,1)[0]);
      }
    }
  }
  if(activeMenu === ''){
    isRouter = true;
    index = true;
    currentType.children = [];
    nav.unshift({path:'/', label:'推荐', type: 'index', activeMenu:'active-menu'});
  }else{
    nav.unshift({path:'/', label:'推荐', type: 'index'});
  }
  if(!isRouter){
    return null;
  }
  return {nav: nav, currentType: currentType, index: index}
}
// 解析目录
function handleArticle (arti){

}