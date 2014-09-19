var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')

var fs = require('fs')

var app = express()
app.use(bodyParser())

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var db = mongoskin.db('mongodb://@localhost:27017/authTestProject', {safe:true})

var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');

passport.use(new LocalStrategy(
  function(username, password, done) {
    var collection = db.collection("user");

    console.log("pwcheck running")

    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.post('/user', function(req, res, next) {
  var collection = db.collection("user")
  collection.find({"user" : req.body.user}).toArray(function(e, results){
    if (e) return next(e)
  
    if (results.length === 0) {
      // username does not exist yet, insert it
        bcrypt.genSalt(5, function(err, salt) {
          if (err) return callback(err);

          bcrypt.hash(req.body.password, salt, null, function(err, hash) {
            if (err) return callback(err);
              
            collection.insert({username: req.body.username, password: hash}, {}, function(e, results){
              if (e) return next(e)
              res.send(results)
            })
          });
        });
    } else {
      res.status(400).send({error:"usernameAlreadyExists"})
    }
  })
})

app.get('/candy', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      console.log(err)
      console.log(info)
      console.log(user)
      res.send()
  })(req, res, next);
})

app.listen(3000)
