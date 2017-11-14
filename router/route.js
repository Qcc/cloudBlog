module.exports = function(app){
  app.get('/',function(req,res){
    res.redirect('/index');
  });

  app.use('/index',require('./page/index.js'));
  app.use('/signin',require('./page/signin.js'));
  app.use('/list',require('./page/list.js'));
  app.use('/registry',require('./page/registry.js'));
  app.use('/edit',require('./page/edit.js'));
  app.use('/contact',require('./page/contact.js'));  
  app.use('/blog',require('./page/blog.js'));  
  app.use('/search',require('./page/search.js'));      
  app.use('/error',require('./page/error.js'));
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('error404');
    }
  });
}