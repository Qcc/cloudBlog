// 网站分组类目管理
var Columns = require('../models/columns');
var Articles = require('../models/article');
var Parallel = require('async/parallel');
var Waterfall = require('async/waterfall');

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
    var reqUrl = getColAndArticlePath(req.baseUrl);
    if(reqUrl.artPath){
      // 请求的是页面 渲染详情页
      requireArticle(req, res, next, reqUrl);
    }else{
      // 请求的是类目，渲染列表   
      requireColumn(req, res, next, reqUrl);
    }
  }
}
function requireColumn (req, res, next, reqUrl){
  Waterfall([
    function(callback) {
      Columns.find({},function(err, column){
        callback(err, column);
      });
    },
    function(column, callback) {
      var currentId = '';
      var parentId = '';      
      var allCol = [{categoryPath: reqUrl.colPath}];
      for (let i = 0; i < column.length; i++) {
        if(reqUrl.colPath === column[i].path){
          parentId = column[i].parent;
          currentId = column[i]._id;
          break;
        }
      }
      if(!parentId){
        for (let j = 0; j < column.length; j++) {
          if(column[j].path === 'shenghuo'){
            console.log('parent22 ',column[j].parent === currentId,column[j].parent, currentId)            
          }
          if(column[j].parent === currentId){
            allCol.push({categoryPath: column[j].path});
          }
        }
      }
      Articles.find({"$or": allCol},function(err, articles){
        callback(err, column, articles);
      })
    }
    ], 
    function (err, column, articles) {
      var col = handleCol(column, req.baseUrl.slice(1))
      if(!col){
        next();
      }
      var articleList = handleArti(articles)
      return res.render('./news/index',{
        nav: col.nav, // 侧边目录导航
        currentType: col.currentType, // 当前子类
        index: col.index, // 是否请求首页
        artiList: articleList // 文章列表
      });
  });
}
function requireArticle (req, res, next, reqUrl){
  Parallel({
    col: function(callback) {
      Columns.find({},function(err, column){
        callback(err, column);
      });
    },
    arti: function(callback) {
      if(reqUrl.articlePath === undefined){
        Articles.find({categoryPath: reqUrl.colPath},function(err, article){
          callback(err, article);
        }).sort({_id:-1}).limit(10);
      }else{
        Articles.findOne({_id: reqUrl.articlePath},function(err, article){
          callback(err, article);
        })
      }
    }
  },
  function(err, results) {
    if(err){
      console.log(err)
      return err;
    }
        
  });
}
// Parallel({
//   col: function(callback) {
//     Columns.find({},function(err, column){
//       callback(err, column);
//     });
//   },
//   arti: function(callback) {
//     Articles.find({},function(err, article){
//       callback(err, article);
//     }).sort({_id:-1}).limit(10);;
//   }
// },
// function(err, results) {
//   if(err) return res.render('error');
//   var col = handleCol(results.col, req.baseUrl.slice(1))
//   if(!col){
//     next()
//   }
//   var articleList = handleArti(results.arti)
//   return res.render('./news/index',{
//     nav: col.nav, // 侧边目录导航
//     currentType: col.currentType, // 当前子类
//     index: col.index, // 是否请求首页
//     artiList: articleList // 文章列表
//   });  
// });

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
// 处理文章
function handleArti(articles){
  for(let i = 0; i < articles.length; i++){
    articles[i].strDate = fromantDate(articles[i].date);
    articles[i].articlePath = articles[i].categoryPath + '/' + articles[i]._id + '.html'
  }
  return articles
}

// 修改日期格式
function fromantDate (d){
  var date = new Date(d);
  var year = date.getFullYear();
  var mon = ComplementZero(date.getMonth() + 1);
  var day = ComplementZero(date.getDate());
  var hour = ComplementZero(date.getHours());
  var min = ComplementZero(date.getMinutes());
  var sec = ComplementZero(date.getSeconds());
  var strDate = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  return strDate;
}
function ComplementZero(number){
  if(number < 10){
    return '0' + number;
  }else{
    return number;
  }
}
// 解析请求url 拆分出目录 与文章ID
function getColAndArticlePath(url){
  var reqUrl = {}
  if(url === ''){
    // 请求首页展示最新内容
    return reqUrl;
  }
  var urls = url.split('/');
  if(urls[urls.length - 1].endsWith('.html')){
    reqUrl.artPath = urls[urls.length - 1].split('.')[0];
  }
  reqUrl.colPath = urls[1];
  return reqUrl
}