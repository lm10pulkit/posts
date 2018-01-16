const express     = require('express');
const bodyparser  = require('body-parser');
const cookieparser= require('cookie-parser');
const session     = require('express-session');
const passport = require('passport');
var strategy = require('passport-local').Strategy;
var {hash,compare}= require('./hashing.js');
var {save,finduser,savepost,findpost,deletepost,find,findbyid,addcomment,deletecomment}= require('./db.js');

// express app
 var app= express();
 //loggedin 
 var loggedin = function(req,res, next){
  if(req.user)
    next();
  else
    res.redirect('/login');
 };
 // not loggecin 
 var notloggedin = function(req,res,next){
    if(req.user)
      res.redirect('/newsfeed');
    else
      next();
 }
 //middle register
 var middleregister= function(req,res,next)
 {  
    hash(req.body.password,function(err,hash){
      if(err)
        res.redirect('/register');
      else{
          req.body.password= hash;
          next();
         } 
    });
 };
 // setting view engine
app.set('view engine','ejs');
//for forms
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// middleware for cookie parser

app.use(cookieparser());

//middleware for session
app.use(session(
	{
		secret:'secret',
	    saveUninitialized:true,
		resave:true
	}));
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());
//welcome app
app.get('/',notloggedin,function(req,res){
res.render('login');
});
//register route
app.get('/register',notloggedin,function(req,res){
res.render('register');
});
// login route
app.get('/login',notloggedin,function(req,res){
res.render('login');
});
//setting up local strategy
passport.use(
  new strategy(function(username,password, done )
  {
      console.log('in the local srategy');
      finduser(username,function(err,user){
        if(err)
          throw err;
        if(!user)
          return done(err,false);
        console.log(err);
        console.log(user);
        compare(password,user.password,function(err,match){
          if(err)
            throw err;
          if(match)
           return     done(null,user);
          else
            return done(null,false);
        });
      });
}));

//serializing user
passport.serializeUser(function(user,done){
 done(null,user.username);
});
// deserializing user
passport.deserializeUser(function(username,done){
  finduser(username,function(err,user){
     done(err,user);
  });
});
//post route for register
app.post('/register',middleregister,function(req,res){
   save(req.body);
   res.redirect('/login');
});
//logging in
app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),function(req,res){
      res.render('options');
});
// saving a post
app.post('/savepost',loggedin,function(req,res){
  var obj = {user : {userid:req.user._id,username:req.user.username}, content:req.body.content};
    savepost(obj,function(err,data){
      if(err)
        throw err;
      console.log(data);

    });
    res.render('options');
});
// my wall
app.get('/mywall',loggedin, function(req,res){
     findpost({userid:req.user._id.toString(),username:req.user.username},function(err,data){
        console.log(data);
            res.render('mywall',{posts:data});
     });
});
// deleting a post
app.post('/deletepost',loggedin,function(req,res){
       deletepost(req.query.id,function(err,data){
         console.log(data);
         if(req.query.check)
         res.redirect('/newsfeed');
         else
         res.redirect('/mywall');
       });
});
// newsfeed
app.get('/newsfeed',function(req,res){
       find(function(err,data){
         res.render('newsfeed',{posts: data,user:req.user});
       });
});
//comment
app.post('/comment',loggedin,function(req,res){
     console.log('in the command');
   var comment = {userid:req.user._id.toString(),username:req.user.username , content: req.body.content};
       addcomment(req.query.id.toString(),comment,function(err,docs){
         console.log(docs);
         res.redirect('/newsfeed');
       });
});
//deletecomment
app.post('/deletecomment',loggedin,function(req,res){
    deletecomment(req.query.postid.toString(), req.query.commentid.toString(), function(err,data){
        console.log(data);
        res.redirect('/newsfeed');
    });
} );
//logout
app.get('/logout',loggedin,function(req,res){
     req.logout();
     res.redirect('/login');
});
//connection to the post
const port =process.env.PORT||8080;

app.listen(port,function(err){
   if(err)
     console.log(err);
   else
     console.log('connected to the port 8080');
});