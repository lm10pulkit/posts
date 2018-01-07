const mongodb= require('mongodb');
const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/post');
var userschema = require('./userschema.js');
var user=mongoose.model('user', userschema);
var postschema = require('./postschema.js');
var post=mongoose.model('poste',postschema);
var findbyid= function(id,callback){
     post.findById(id,callback);
};
var addcomment = function(id,commentobj,callback){
      post.update({_id:id},{$push :{ comment :commentobj}},callback);
};
var deletecomment = function(id , commentid, callback){
    post.update({_id:id},{$pull : {comment :{_id : commentid}}},callback );
};
var savepost = function(poste, callback){
    var new_post= new post(poste);
    new_post.save(callback);
};
var findpost= function(userobj, callback){
	console.log(userobj);
   post.find({user:userobj}, callback);
};
var deletepost = function(id,callback){
      post.remove({_id:id},callback);
};
var find = function(callback){
   post.find({},callback);
};
var save = function(data){
    var new_user= new user(data);
    new_user.save().then(function(data){
    	console.log(data);
    },
    function(err){
    	console.log(err);
    });
};

var finduser= function(username,callback){
    user.findOne({username:username},callback);
};
module.exports={save,finduser,savepost,findpost,deletepost,find,findbyid,addcomment,deletecomment};
var choice= function(y,id,callback){
   user.findById(id,function(err,data){
         callback(y,err,data);
   });
};
var func= function(data, callback){
    var userarr=[];
    for(var x=0;x<data.length;x++)
    {

       choice(x,data[x].user.userid.toString(),function(y,err,ui){
           userarr.push(ui);
           if(y==data.length-1)
            callback(userarr);
       });
    
    }
};
post.find({},function(err,data){
  func(data,function(magic){
     console.log(magic);
  });
});
