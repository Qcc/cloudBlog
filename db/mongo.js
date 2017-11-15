var mongouri = require('../config/default').mongodb;
var mongoose =require('mongosse');
var Schema = mongoose.Schema;
mongose.connect(mongoUri,function(err){
  console.log(err,'链接数据库失败！');
});

var blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments:[{author: String,body: String,date: Date}],
  date: {type: Date, default:Date.now},
  hidden:Boolean,
  recommend:Boolean,
  meta:{read:Number,comment:Number}
});
blogSchema.methods.chazhao = function(cb){
  return this.model('Blog').find({author:kevin});
}

var Blog = mongoose.model('Blog',blogSchema);
var b1 = new Blog({author:'kevin'});

b1.chazhao(function(err,blog){
  console.log(blog,"11111");
});