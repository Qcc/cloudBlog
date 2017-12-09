var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var parentSchema = new Schema({
  label: {type: String, required: true},
  idx: {type: Number, required: true},
  level: {type: Number, required: true}
});
var columnsSchema = new Schema({
  label: {type: String, required: true},
  idx: {type: Number, required: true},
  level: {type: Number, required: true},
  parent: parentSchema,  
  date:{type: Date, default:Date.now}
});

const columns = mongoose.model('columns',columnsSchema);

module.exports = columns;