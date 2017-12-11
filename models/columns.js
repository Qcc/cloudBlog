var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var parentSchema = new Schema({
  label: {type: String, required: true},
  level: {type: Number, required: true},
  parentId: {type: String, required: true},  
});
var columnsSchema = new Schema({
  label: {type: String, required: true},
  level: {type: Number, required: true},
  parent: parentSchema,  
  date:{type: Date, default:Date.now}
});

const columns = mongoose.model('columns',columnsSchema);

module.exports = columns;