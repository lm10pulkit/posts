const bcrypt = require('bcrypt');
var saltrounds =10;
var hash = function(password, callback){
     bcrypt.hash(password,saltrounds,callback);
};
var compare= function(password,hash,callback)
{
   console.log(hash+" "+ password);
   bcrypt.compare(password,hash,callback);
};
module.exports={
 hash,
 compare
};