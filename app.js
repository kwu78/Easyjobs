//Including modules
var mysql = require('mysql');
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
var path = require('path');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptnode = require('bcrypt-nodejs');
const saltRounds = 10;
const LocalStrategy = require('passport-local').Strategy;
const MySQLStore = require('mysql-express-session')(session);
var flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const Email = require('email-templates');
var nodemailer = require('nodemailer');


// const GoogleStrategy=require('passport-google-oauth20').Strategy;

//connecting to mysql and localhost
var options = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Easyjobs',
};

app.use(session({
    key: 'kevinwu',
    secret: 'oursecrets',
    resave: true,
    saveUninitialized: true
}));

//variables
var Introduction = "Type";
var interests = [];
var name = "Kevin";
var university = "";
var intro = "";
var gradyear = "";
var grades = "";


var con = mysql.createConnection(options);

app.use(passport.initialize()); //use passport and initialize passport package

app.use(passport.session());
app.use(flash());
app.use(cookieParser());

con.query('USE Easyjobs');

con.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected!");
    }
});

var sql3 = "CREATE TABLE IF NOT EXISTS Subscribe(email varchar(80) NOT NULL)"
con.query(sql3, function (err) {
    if (err) throw err;
    console.log("Subscribe Table Created");
})

/*
var sql3 = "DROP TABLE Talent"
con.query(sql3, function(err) {
    if (err) throw err;
    console.log("Talent table dropped");
})

var sql3 = "DROP TABLE Users"
con.query(sql3, function(err) {
    if (err) throw err;
    console.log("Users table dropped");
})
*/

//software_engineer



app.get("/software_engineer", function (req, res) {
    res.render('software_engineer')
});

app.get("/finance", function (req, res) {
    res.render('finance')
});


app.get("/jobpage", function (req, res) {
    res.render('jobpage')
});




//res.render('index.ejs', {
//    link: "software_engineer.ejs"
//});

//contact
app.get("/contact", function (req, res) {
    res.render('contact')
});

var sql = "CREATE TABLE IF NOT EXISTS Users (UserID int NOT NULL AUTO_INCREMENT,username varchar(20) NOT NULL,password varchar(120) NOT NULL,email varchar(50) NOT NULL,type char(3) NOT NULL,constraint PK_UserID PRIMARY KEY(UserID))";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Users Table created");
});


var sql2 = "CREATE TABLE IF NOT EXISTS Talent (Tal_ID tinyint NOT NULL AUTO_INCREMENT,Tal_CnName varchar(50),Tal_EngName varchar(50) not null,Tal_DOB DATE not null,Tal_intro varchar(150),Tal_Age tinyint not null,Tal_Gender varchar(10) not null,Tal_MobileNum varchar(15) not null,Tal_HomeNum varchar(15),Tal_Email varchar(50),Tal_Address varchar(50),Tal_Premium char(1) not null,Tal_GradSchool varchar(50),Tal_GradLvl varchar(15),Tal_GradGrade FLOAT,Tal_GradDate date,UserID int,constraint PK_Tal_ID PRIMARY KEY(Tal_ID),constraint FK_UserID FOREIGN KEY(UserID) references Users(UserID))";
con.query(sql2, function (err, result) {
    if (err) throw err;
    console.log("Talent Table Created");
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");



// passport.use('local-signup', new LocalStrategy(
//         {
//         passReqToCallback: true
//     },
//     function(req,username,password,email,done) {
//         con.query("SELECT *FROM Users where username=?", [username], function(err, rows) {
//             if (err) {
//                 return done(err);
//             }
//             if (rows.length) {
//                 return done(null, false, req.flash('signupMessage', 'That is alreadytaken'));
//             }
//             else {
//                 const newUserMysql = {
//                     username: username,
//                     password: bcryptnode.hashSync(password, null, null),
//                     email: email,
//                     type: "T"
//                 };
//                 var insert = "INSERT INTO Users (username,password,email,type) values (?,?)";
//                 console.log(newUserMysql.username, newUserMysql.password, newUserMysql.email, newUserMysql.type);
//                 con.query(insert, [newUserMysql.username, newUserMysql.password, newUserMysql.email, newUserMysql.type], function(err, rows) {
//                     // newUserMysql.Userid = rows.insertId;
//                     return done(null, newUserMysql);
//                 });
//             }
//         });
//     })
// );

//user login
passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        con.query("SELECT * FROM Users WHERE username=?", [username],
            async function (err, row) {
                if (err) {
                    console.log("error occured");
                    return done(err);
                }
                if (!row.length) {
                    console.log("no user");
                    return done(null, false, req.flash('loginMessage', 'No User Found'));
                }
                const match = await bcrypt.compare(password, row[0].password)
                if (match) {
                    return done(null, row[0], req.flash('loginMessage', 'You have Successfully Logged In!!'));
                }
                return done(null, false, req.flash('loginMessage', 'Wrong Password'));
            });
    }));

passport.serializeUser(function (user, done) {

    done(null, user.UserID);
});

passport.deserializeUser(function (id, done) {
    con.query('select * from Users where UserID = ?', [id], function (err, rows) {
        done(err, rows[0]);
    });
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/employee-signup", function (req, res) {
    res.render('signup', {
        message: req.flash('signupMessage')
    });
});

app.get("/login", function (req, res) {
    res.render("login", {
        message: req.flash('loginMessage')
    });
});

app.post("/login", passport.authenticate('local-login', {
        succcessRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function (req, res) {
        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 4;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/profile');
    });


app.get("/profile", isLoggedIn, function (req, res) {

    var userID = req.user.UserID;
    const sql3 = "SELECT * FROM Talent WHERE UserID=" + userID;
    con.query(sql3, function (err, result) {
        if (err) throw err;
        res.render('profile', {
            data: result,
            passion: interests,
            message: req.flash('loginMessage')
        })
    });
});

app.get('/logout', function (req, res) {
    console.log("logging out");
    req.logout();
    req.flash('loginMessage', 'You Have Logged Out!')
    res.redirect('/login');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.post("/interest", function (req, res) {
    let interest = req.body.newInterest;
    interests.push(interest);
    res.redirect("/profile");
});

app.post("/profile-basic", function (req, res) {
    var userID = req.user.UserID;
    sql5 = "UPDATE Talent SET ? WHERE UserID=" + userID;
    const information = new Object({
        "Tal_EngName": req.body.name,
        "Tal_GradSchool": req.body.university,
        "Tal_GradLvl": req.body.year,
        "Tal_GradGrade": req.body.gpa
    });
    con.query(sql5, information, function (err) {
        if (err) {
            throw err;
        } else {
            res.redirect("/profile");
        }
    });

    const myForm = document.getElementById("myForm");
    const inpFile = document.getElementById("inpFile");

    profile - pic.addEventListener("submit", e => {
        e.preventDefault();

        const endpoint = "upload.php"
        const formData = new FormData();

        console.log(inpFile.files);

        formData.append("inpFile", inpFile.files[0]);
    })
});

app.post("/profile-intro", function (req, res) {
    var userID = req.user.UserID;
    sql5 = "UPDATE Talent SET ? WHERE UserID=" + userID;
    const information = new Object({
        "Tal_intro": req.body.postBody
    });
    con.query(sql5, information, function (err) {
        if (err) {
            throw err;
        } else {
            res.redirect("/profile");
        }
    });
});

app.post("/signup", function (req, res) {

    con.query("SELECT *FROM Users WHERE username=? OR email=?", [req.body.username, req.body.email], function (err, rows) {
        if (err) {
            failureFlash = true;
            res.redirect('/employee-signup');
            req.flash('signupMessage', err);
            throw err;
            con.end();
        }
        if (rows.length) {
            console.log("taken");
            failureFlash = true;
            req.flash('signupMessage', 'Email or username is already taken');
            res.redirect('/employee-signup');
        } else {

            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                const users = new Object({
                    "username": req.body.username,
                    "password": hash,
                    "email": req.body.email,
                    "type": "T"
                });
                const talent = new Object({
                    "Tal_CnName": req.body.cnName,
                    "Tal_EngName": req.body.fName + " " + req.body.lName,
                    "Tal_DOB": req.body.DOB,
                    "Tal_Age": 99,
                    "Tal_Gender": req.body.gender,
                    "Tal_MobileNum": req.body.Mobilenumber,
                    "Tal_HomeNum": "",
                    "Tal_Email": req.body.email,
                    "Tal_Address": "",
                    "Tal_Premium": "F",
                    "Tal_GradSchool": req.body.school,
                    "Tal_GradLvl": req.body.year,
                    "Tal_GradGrade": req.body.grades,
                    "Tal_GradDate": req.body.graddate,

                });

                con.query("INSERT INTO Users SET ?", users, function (err) {
                    if (err) {
                        console.log(err);
                        res.redirect("/employee-signup");
                    } else {
                        console.log("inserted users");
                        passport.authenticate("local")(req, res, function () {

                            res.redirect("/profile");
                        })
                    }
                });
                var values =
                    req.body.cnName + "','" + req.body.fName + ' ' + req.body.lName + "','" + req.body.DOB + "','" + 99 + "','" + req.body.gender + "','" + req.body.Mobilenumber + "','" + " " + "','" +
                    req.body.email + "','" + "' " + "','" + "'F'" + "','" + req.body.school + "','" + req.body.year + "','" + req.body.grades + "','" + req.body.graddate +
                    "')'";
                con.query("INSERT INTO Talent(Tal_CnName, Tal_EngName,Tal_DOB,Tal_Age,Tal_Gender,Tal_MobileNum, Tal_HomeNum,Tal_Email,Tal_Address,Tal_Premium,Tal_GradSchool,Tal_GradLvl,Tal_GradGrade,Tal_GradDate,UserID) VALUES('" + req.body.cnName + "','" + req.body.fName + '_' + req.body.lName +
                    "','" + req.body.DOB + "','" + 99 + "','" + req.body.gender + "','" + req.body.Mobilenumber + "','" + '-' + "','" + req.body.email + "','" + '-' + "','" + 'F' + "','" + req.body.school + "','" + req.body.year + "','" + req.body.grades + "','" + req.body.graddate + "',(SELECT UserID FROM Users WHERE username=?))", [req.body.username]);
            });
        }
    });
});

app.get("/success", function (req, res) {
    res.render("success");
});

app.get('/taken', function (req, res) {
    res.render("Taken");
});

//defining the email sender function
async function emailSender(target) {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        ignoreTLS: false,
    secure: false,
        host:'Easyjobs998@gmail.com',
        auth: {
            user: 'Easyjobs998@gmail.com',
            pass: 'job4me!!'
        }
    });

    var mailOptions = {
        from: 'Easyjobs998@gmail.com',
        to: target,
        subject: 'Welcome to Easyjobs',
        text: 'You will pursue your dream here!'
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent to: ' + target);
        }
    });
}

app.post("/", function (req, res) {
    con.query("SELECT *FROM Subscribe WHERE email=?", [req.body.Email], function (err, rows) {
        if (err) {
            failureFlash = true;
            res.redirect('/');
            req.flash('signupMessage', err);
            throw err;
            con.end();
        }
        
        if (rows.length) {
            console.log("taken");
            failureFlash = true;
            req.flash('signupMessage', 'Email is already subscribed');
            res.redirect('/taken');
        } 
        else {

            //Unregistered email: sending email
            //formatting the mail
            emailSender(req.body.Email).catch(console.error);

            //inserting into sql
            
            con.query("INSERT INTO Subscribe(Email) VALUES(?)", req.body.Email, function(err) {
                if (err) {
                    console.log(err);
                } else {
                   
                    // email.send(
                    // {
                    //     template:'welcome',
                    //     message:{
                    //         to:req.body.Email
                    //     }
                    // });
                     console.log("subscribe");
                    res.redirect("/success");
                }
            }); 
        }
    });
});
// app.post("/", function (req, res) {
//      emailSender(req.body.Email).catch(console.error);
//  });


app.listen(3000, function () {
    console.log("server now running");
});

process.on('uncaughtException', function (err) {
    console.log(err);
});


console.log("EOF");
