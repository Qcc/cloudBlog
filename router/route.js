var columnsController = require('../controller/columns');
module.exports = function(app){
  // server端
  app.use('/kevin',require('./server/admin.js'));  
  
  // client
  app.use('*',require('./client/find.js'));
  // app.use('/',require('./client/index.js'));  
  // app.use('/index',require('./client/index.js'));
  // app.use('/images',require('./client/images.js'));
  // app.use('/image',require('./client/image.js'));  
  // app.use('/new',require('./client/new.js'));
  
  // 404 page
  app.use('/error',require('./client/error.js'));
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('./news/error404');
    }
  });
}