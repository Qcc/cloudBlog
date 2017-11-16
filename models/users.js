var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String,required: true,unique: true},
  pwd: {type: String,required: true},
  createdDate: {type: Date,default: Date.now},
  permissions:{type: String,default: '管理要'}
});

const Users = mongoose.model('user',userSchema);

module.exports = Users;