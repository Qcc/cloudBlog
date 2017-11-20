var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String,required: true},
  pwd: {type: String,required: true},
  createdDate: {type: Date,default: Date.now},
  permissions:{type: String,enum: ['管理员','操作员','伙伴管理员','伙伴操作员']}
});

const post = mongoose.model('11',userSchema);

module.exports = post;