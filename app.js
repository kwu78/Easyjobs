var mysql = require('mysql');
const express= require("express");
const ejs = require("ejs");
const bodyParser=require("body-parser");
const app=express();
var path = require('path');
var Introduction="Type";
var interests=[];
var name="Kevin";
var university="";
 var intro="";
var gradyear="";
var grades="";
var con=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'Bapsxx123',
	database : 'easyjobs'
});

con.connect(function(err) {
  if(err){
console.log(err);
  }
  else{
  	 console.log("Connected!");
  }
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


// var connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '',
// 	database : 'nodelogin'
// });


app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");
});
app.get("/employee-signup",function(req,res){
	res.render('signup');
});

app.get("/profile",function(req,res){
	res.render('profile',{introduce:Introduction,passion:interests,Name:name,University:university,Intro:intro,Gradyear:gradyear,
		Grades:grades});
})
app.post("/interest",function(req,res){
let interest=req.body.newInterest;
interests.push(interest);
res.redirect("/profile");
})
app.post("/profileIntro",function(req,res){
		Introduction=req.body.postBody;
		res.redirect("/profile");
});

app.post("/profile-basic",function(req,res){
	    name=req.body.name;
	    university=req.body.university;
	    intro=req.body.briefIntro;
     gradyear=req.body.year;
     grades=req.body.gpa;
	res.redirect("/profile");

});
app.post("/signup",function(req,res){

	var users={
		"userName":req.body.userName,
		"password":req.body.password,
		"email":req.body.email,
		"type":"T"
	}
		  	// var UserID=1;
     //    var userName=req.body.userName;
     //    var password=req.body.password;
     //    var email=req.body.email;
     //    var type="Talent";

    
con.query("INSERT INTO Users SET ?",users,function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("inserted successfully");
	}
});
res.redirect("/profile");
});
app.listen(3000,function(){
	console.log("server now running");
});
