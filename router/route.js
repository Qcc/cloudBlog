var columnsController = require('../controller/columns');
module.exports = function(app){
  // client
  app.use('/',require('./client/index.js'));  
  app.use('/index',require('./client/index.js'));
  app.use('/images',require('./client/images.js'));
  app.use('/image',require('./client/image.js'));  
  app.use('/news',require('./client/news.js'));
  columnsController.clientQueryColumn(function(err, column){
    if( err === null){
      for(let i = 0; i < column.length; i++){
        console.log('column[i].path ',column[i].path)
        app.use("/" + column[i].path, require('./client/find.js'));  
      }
    }
  });
  // server端
  app.use('/kevin',require('./server/admin.js'));  
  
  // 404 page
  app.use('/error',require('./client/error.js'));
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('./news/error404');
    }
  });
}