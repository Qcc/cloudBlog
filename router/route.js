module.exports = function(app){
  app.get('/',function(req,res){
    res.redirect('/index');
  });

  app.use('/index',require('./page/index.js'));
  app.use('/images',require('./page/images.js'));
  app.use('/news',require('./page/news.js'));  
  app.use('/error',require('./page/error.js'));
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('./news/error404');
    }
  });
}