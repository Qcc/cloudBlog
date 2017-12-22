var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: {type: String, required: true},
  author: {type: String, default: '佚名'},  
  titleImg: {type: String},
  category: {type: String, required: true},
  keyword: {type: String, required: true},
  summary: {type: String, required: true},
  content: {type: String, required: true},
  type: {type: String, required: true},
  view: {type: Number},
  like: {type: Number},  
  date:{type: Date, default:Date.now}
});
console.log('11111111111111111111')
const articles = mongoose.model('articles',articleSchema);

module.exports = articles;