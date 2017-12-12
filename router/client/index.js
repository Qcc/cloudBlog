var express = require('express');
var router = express.Router();
var Columns = require('../../controller/columns');

router.get('/',function(req,res,next){
  res.header("X-Powered-By", 'ASP.NET');
  res.header("Server", 'Microsoft-IIS/6.0');
  Columns.queryAllNav(function(err, doc){
    if(err) return res.render('error');
    var docment = doc.map(function(value,index,arr){
      if(value.parent !== null){
        arr.splice(index,1)
      }
    })
    console.log("doc ", docment);
    return res.render('./news/index',{nav: docment, title:'个人博客'});
  })
});


module.exports = router;