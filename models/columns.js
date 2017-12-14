var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var columnsSchema = new Schema({
  label: {type: String, required: true, unique: true},
  level: {type: Number, required: true},
  path: {type: String, required: true, unique: true},
  type: {type: String, required: true},
  parent: {type: String},  
  date:{type: Date, default:Date.now}
});

const columns = mongoose.model('columns',columnsSchema);

module.exports = columns;