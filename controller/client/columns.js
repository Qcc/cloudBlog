// 网站分组类目管理
var Columns = require('../../models/columns');
var Articles = require('../../models/article');
var Parallel = require('async/parallel');
var Waterfall = require('async/waterfall');
var redis = require('../../db/redis');
const tag = new Date().getHours();
module.exports = {
  clientQueryColumn:function(req, res, next){
    var reqUrl = getColAndArticlePath(req.baseUrl);
    if(reqUrl.artPath){
      //页面访问量view+1
      Articles.update({_id: reqUrl.artPath},{$inc:{view: 1}},function(err,doc){
      });
      // 实时页面访问量最大，计入redis 每小时更新
      redis.ZINCRBY(reqUrl.colPath + tag,1,reqUrl.artPath,function(err, response){
        console.log('gengxin',err,response)      
      })
      // 删除过去一小时的访问量缓存
      redis.ZREMRANGEBYRANK (reqUrl.colPath + tag - 1,0,9999999,function(err, response){
        console.log('shanchu',err,response)
      })
      requireArticle(req, res, next, reqUrl);      
      // redis.exists(reqUrl.artPath,function(err,reply){
      //   if(reply){
      //     redis.HGETALL(reqUrl.artPath, function(err, redisData){
      //       console.log('redis缓存')
      // console.log('bestViewList ',redisData.bestViewList)
            
      //       return res.render('./news/news',{
      //         nav: JSON.parse(redisData.nav), // 顶部目录导航
      //         article: JSON.parse(redisData.article), // 文章详情
      //         relatedCount: JSON.parse(redisData.relatedCount), // 相关推荐文章总数
      //         relatedList: JSON.parse(redisData.relatedList), // 相关文章推荐
      //         bestViewList: JSON.parse(redisData.bestViewList) // 热点文章
      //       });
      //     });
      //   }else{
      //     // 请求的是页面 渲染详情页
      //     requireArticle(req, res, next, reqUrl);
      //   }
      // });
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
      if(reqUrl.colPath === undefined){
        // 请求目录为空，返回首页内容 
        Articles.find({},{"content":0,"keyword":0},function(err, articles){
          callback(err, column, articles);
        }).sort({_id:-1}).limit(20);
      }else{
        var allCol = [{categoryPath: reqUrl.colPath}];
        for (let i = 0; i < column.length; i++) {
          if(reqUrl.colPath === column[i].path){
            // mongoose 自动解析_id 与id 字段相同      
            parentId = column[i].parent;
            currentId = column[i].id;
            break;
          }
        }
        if(!parentId){
          for (let j = 0; j < column.length; j++) {
            if(column[j].parent === currentId){
              allCol.push({categoryPath: column[j].path});
            }
          }
        }
        // 如果当前请求目录是父目录，查询当前目录与子目录所有文章 
        Articles.find({"$or": allCol},{"content":0,"keyword":0},function(err, articles){
          callback(err, column, articles);
        }).sort({_id:-1}).limit(20);
      }
    },
    function(column, articles,callback){
      redis.ZRANGE(reqUrl.colPath+tag,0,4,function(err,response){
        callback(err, column, articles,response);
      })
    },
    function(column, articles,response,callback){
      var redian = []
      for (var i = 0; i < response.length; i++) {
        redian.push({_id: response[i]});
      }
      Articles.find({"_id":redian},{"content":0,"keyword":0}, function(err, bestView){
        callback(err, column, articles,bestView);
      }).limit(4);
    }], 
    function (err, column, articles, bestView) {
      var col = handleCol(column, req.baseUrl.slice(1))
      if(!col){
        return next();
      }
      var articleList = handleArti(articles);
      var bestViewList = handleArti(bestView);
      // console.log('bestViewList ',bestViewList);
      return res.render('./news/index',{
        nav: col.nav, // 侧边目录导航
        currentType: col.currentType, // 当前子类
        index: col.index, // 是否请求首页
        artiList: articleList, // 文章列表
        bestViewList: bestViewList // 实时浏览最多文章        
      });
  });
}
function requireArticle (req, res, next, reqUrl){
  Waterfall([
    function(callback) {
      Columns.find({},function(err, column){
        callback(err, column);
      });
    },
    function (column, callback) {
      Articles.findOne({_id: reqUrl.artPath, categoryPath: reqUrl.colPath},function(err, article){
        callback(err, column, article);
      });
    },
    function (column, article, callback) {
      if (!article) {
        console.log('没有查到文章')
        return next();
      }
      var keywords = []
      for (var i = 0; i < article.keyword.length; i++) {
        keywords.push({keyword: article.keyword[i]});
      }
      Articles.find({"title":{$ne: article.title},$or : keywords },{"content":0,"keyword":0}, function(err, related){
        callback(err, column, article, related);
      }).limit(10).sort({_id:-1});
    },
    function (column, article, related, callback) {
      var keywords = []
      for (var i = 0; i < article.keyword.length; i++) {
        keywords.push({keyword: article.keyword[i]});
      }
      Articles.count({"title":{$ne: article.title},$or : keywords }, function(err, relatedCount){
        callback(err, column, article, related, relatedCount);
      }); 
    },
    function(column, article, related, relatedCount,callback){
      redis.ZRANGE(reqUrl.colPath+tag,0,4,function(err,response){
        callback(err, column, article, related, relatedCount,response);
      })
    },
    function(column, article, related, relatedCount,response,callback){
      var redian = []
      for (var i = 0; i < response.length; i++) {
        redian.push({_id: response[i]});
      }
      Articles.find({"_id":redian},{"content":0,"keyword":0}, function(err, bestView){
        callback(err, column, article, related, relatedCount,bestView);
      }).limit(4);
    }],
    function(err, column, article, related, relatedCount, bestView) {
      if(err){
        console.log('查询出错了',err)
        return next();
      }
      var nav = [];
      column.map(function(item){
        if(!item.parent){
          nav.push(item);
        }
      });
      nav.sort(function(a, b){
        return a.level - b.level;
      });
      
      article.strDate = fromantDate(article.date);
      var relatedList = handleArti(related);
      var bestViewList = handleArti(bestView);
      // 将查询到的数据缓存到redis中
      // redis.HSETNX (reqUrl.artPath,'nav',JSON.stringify(nav));
      // redis.HSETNX (reqUrl.artPath,'article',JSON.stringify(article));
      // redis.HSETNX (reqUrl.artPath,'relatedCount',JSON.stringify(relatedCount));
      // redis.HSETNX (reqUrl.artPath,'relatedList',JSON.stringify(relatedList));
      // redis.HSETNX (reqUrl.artPath,'bestViewList',JSON.stringify(bestViewList));
      console.log('bestViewList ',bestViewList)
      return res.render('./news/news',{
        bestViewList: bestViewList, // 实时浏览最多文章
        nav: nav, // 顶部目录导航
        article: article, // 文章详情
        relatedCount: relatedCount, // 相关推荐文章总数
        relatedList: relatedList // 相关文章推荐
      });
  });
}
// db.articles.find({"title":{$ne: article.title},$or : [ {keyword : keyword}]});

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
  var navlist = {nav: nav, currentType: currentType, index: index}
  return navlist;
}
// 处理文章
function handleArti(articles){
  for(let i = 0; i < articles.length; i++){
    articles[i].strDate = fromantDate(articles[i].date);
    articles[i].articlePath = '/'+articles[i].categoryPath + '/' + articles[i]._id + '.html'
    console.log('articles[i].articlePath ',articles[i].articlePath)
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
// mongo ID 简单混淆
// var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
// function idEncode(id){
//   id = String(id)
//   if(typeof id !== 'string' || id.length !== 24){
//     return id
//   }
//   var start = id.slice(0,3);
//   var middle = id.slice(3,6);
//   var end = id.slice(6);
//   var str1 = chars[Math.floor(Math.random() * 16)];
//   var str2 = chars[Math.floor(Math.random() * 16)];
//   return start + str1 + middle + str2 + end;
// }
// function idDiscode(id){
//   id = String(id)
//   if(typeof id !== 'string' || id.length !== 26){
//     return id
//   }
//   var start = id.slice(0,3);
//   var middle = id.slice(4,7);
//   var end = id.slice(8);
//   return start + middle + end;
// }