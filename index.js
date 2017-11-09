var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public',{
  redirect:true
}));
app.get('/', function (req, res) {
  res.send('Hello World!');
});
// 404 page
app.use(function (req, res) {
  if (!res.headersSent) {
    res.end('error,not found page!');
  }
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});