const mongoose= require('mongoose');
var schema = mongoose.Schema ;
var userschema = new schema ({
   name : {
   	type:String ,
   	required:true,
   	trim : true
   },
    username :{
    	type:String,
    	required:true,
    	unique:true,
    	trim :true
    },
    password:{
    	type:String ,
    	required:true
    }
}) ;
module.exports=userschema;