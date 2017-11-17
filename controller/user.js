var User = require('../models/users');

module.exports = {
  createUser:function(req,res,next){
    User.create({username:'diyigeyonghu',pwd:'123456'},function(err){
      if(err){
        res.send(err);
      }else{
        res.send({status:'创建用户成功'})
      }
    });
  },
  findByName:function(req,res,next){
    console.log(req.cookie);
    var j = req.toString();
        res.send(j);    
    // User.find({username: 'diyigeyonghu'},function(err,users){
    //   if(err){
    //     res.send(err);
    //   }else{
    //     res.send(users);
    //   }
    // });
  }
}