const mongoose= require('mongoose');
const schema = mongoose.Schema;
var userschema = require('./userschema.js');
var postschema = new schema ({
	user: {
	  userid:String ,
	  username :String 
	},
	content : {
		type:String ,
		required: true
	},
	comment:[{userid:String ,
		username : String ,
		content:String }]
}); 
module.exports=postschema;