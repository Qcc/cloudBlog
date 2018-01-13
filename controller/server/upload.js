// 上传图片模块

var fs = require('fs');
var multer  = require('multer') // 处理上传文件
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
    let path = 'public/uploads/' + now.getFullYear() + (now.getMonth()+1) + now.getDate();
    createFolder(path);
    cb(null, path)
  },
  filename: function (req, file, cb) {
    let name = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, generateMixed(16) + name)
  }
})
var uploadImg = multer({ storage: storage, fileFilter: fileFilter}).single('titleImg');
module.exports = {
  uploadImg: uploadImg,
  upload: function (req, res ,next) {
    if (req.file) {
      res.set('Content-Type', 'text/plain')
      return res.send({
        "status": 200,
        "errno": 0,
        "path": req.file.path.slice(req.file.path.indexOf('/') + 1),
      });
    }else{
      return  res.send({
        "status": "-1",
        "errno": -1,
        "msg": '文件上传错误。'
      });
    }
  }
}
