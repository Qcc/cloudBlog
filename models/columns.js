var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var columnsSchema = new Schema({
  label: {type: String, required: true},
  idx: {type: Number, required: true},
  date:{type: Date, default:Date.now},  
  parentLabel: {type: String},  
  parentId: {type: Number}
});

const columns = mongoose.model('columns',columnsSchema);

module.exports = columns;