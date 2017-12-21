var express = require('express');
var router = express.Router();
var Columns = require('../../controller/columns');
var fs = require('fs');
var multer  = require('multer') // 处理上传文件
// 跨域访问设置
//allow custom header and CORS
router.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.header('Access-Control-Allow-Credentials', 'true');  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200); // 让options请求快速返回
  }
  else {
    console.log('tianjiayu')
    next();
  }
});
router.post('/section.api',function(req,res,next){
  console.log('req.body', req.body)
  Columns.createColumns(req, res, next);
});
router.delete('/section.api',function(req,res,next){
  console.log('req.body', req.body);
  Columns.deleteColumns (req, res, next);
});
router.put('/section.api',function(req,res,next){
  Columns.updateColumns(req, res, next);
  console.log('req.body', req.body);  
});
router.get('/section.api',function(req,res,next){
  Columns.queryColumns(req, res, next);
});
// 创建文件夹
var createFolder = function(folder){
  try{
    fs.accessSync(folder); 
  }catch(e){
    fs.mkdirSync(folder);
  }  
};
// 过滤上传文件类型
function fileFilter (req, file, cb) {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif' || file.mimetype === 'image/bmp'){
    // 接受这个文件，使用`true`，像这样:
    cb(null, true)
  } else { 
    // 拒绝这个文件，使用`false`，像这样:
    cb(null, false)
  }
}
// 生成随机数文件名
var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
function generateMixed(n) {
  var res = "";
  for(var i = 0; i < n ; i ++) {
    var id = Math.ceil(Math.random()*35);
    res += chars[id];
  }
  return res;
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let now = new Date();
    let path = 'public/uploads/' + now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    createFolder(path);
    cb(null, path)
  },
  filename: function (req, file, cb) {
    let name = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, generateMixed(16) + name)
  }
})
var upload = multer({ storage: storage, fileFilter: fileFilter});
// var upload = multer({ dest: 'public/uploads/' , fileFilter: fileFilter});
// 文件上传
router.post('/upload.api',upload.single('upfile'),function(req,res,next){
  console.log(req.file);
  res.set('Content-Type', 'text/plain');
  res.send({
    "state": "SUCCESS",
    "url": req.file.path.slice(req.file.path.indexOf('/') + 1),
    "title": req.file.fieldname,
    "original": req.file.originalname
  })
});

router.all('*',function(req,res,next){
  res.send({status: 404, msg: "can't found!"});
});

module.exports = router;