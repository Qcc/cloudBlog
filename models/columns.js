var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var children = new Schema({
  label: {type: String, required: true},
  idx: {type: Number, required: true},  
  date:{type: Date, default:Date.now}
});
var columnsSchema = new Schema({
  label: {type: String, required: true},
  idx: {type: Number, required: true},
  date:{type: Date, default:Date.now},  
  children: [children]
});

const columns = mongoose.model('columns',columnsSchema);

module.exports = columns;