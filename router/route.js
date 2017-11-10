module.exports = function(app){
  app.get('/',function(req,res){
    res.redirect('/index');
  });

  app.use('/index',require('./index.js'));
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.end('error,not found page!');
    }
  });
}