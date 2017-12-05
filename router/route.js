module.exports = function(app){
  // client
  app.get('/',function(req,res){
    res.redirect('/index.html');
  });
  app.use('/index.html',require('./client/index.js'));
  app.use('/images',require('./client/images.js'));
  app.use('/image',require('./client/image.js'));  
  app.use('/news',require('./client/news.js'));
  
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