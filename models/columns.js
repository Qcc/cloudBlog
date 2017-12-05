var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var children = new Schema({
  label: {type: String, required: true},
  id: {type: Number, required: true},  
});
var columnsSchema = new Schema({
  label: {type: String, required: true},
  id: {type: Number, required: true},  
  children: [children]
});

const columns = mongoose.model('columns',columnsSchema);

module.exports = columns;