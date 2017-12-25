var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: {type: String, required: true},
  author: {type: String, default: '佚名'},  
  titleImg: {type: String},
  categoryId: {type: String, required: true},  // 文章所属类目
  categoryPath: {type: String, required: true},
  categoryLabel: {type: String, required: true},
  keyword: {type: Array, required: true},
  summary: {type: String, required: true},
  content: {type: String, required: true},
  type: {type: String, required: true}, //类型 文章 图片 视频
  view: {type: Number},
  like: {type: Number},
  date:{type: Date, default:Date.now}
});
const articles = mongoose.model('articles',articleSchema);

module.exports = articles;