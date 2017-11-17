var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String,required: true,unique: true},
  pwd: {type: String,required: true},
  createdDate: {type: Date,default: Date.now},
  permissions:{type: String,required: true,enum: ['管理员','操作员','伙伴管理员','伙伴操作员']}
});

const Users = mongoose.model('user',userSchema);

module.exports = Users;