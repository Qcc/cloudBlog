var express = require('express');
var router = express.Router();
var columnsController = require('../../controller/columns');

router.get('/',function(req,res,next){
  res.header("X-Powered-By", 'ASP.NET');
  res.header("Server", 'Microsoft-IIS/6.0');
  columnsController.renderIndex(req,res,next);
  console.log('find')
});


module.exports = router;