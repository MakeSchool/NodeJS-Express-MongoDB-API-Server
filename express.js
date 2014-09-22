var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')

var fs = require('fs')
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy, 
BasicStrategy = require('passport-http').BasicStrategy;

var app = express()
  app.use(bodyParser())
  app.use(passport.initialize());

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var db = mongoskin.db('mongodb://@localhost:27017/authTestProject', {safe:true})


var bcrypt = require('bcrypt-nodejs');

passport.use(new LocalStrategy(
  function(username, password, done) {
    var collection = db.collection("user")
    collection.find({"username" : username}).toArray(function(e, results) {
      if (e) { return done(err); }
      if (results.length == 0) {
        // user does not exist
        return done(null, false, { message: 'Incorrect username or password.' });
      } else {
        // incorrect password
        bcrypt.compare(password, results[0].password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
              return done(null, {});        
            } else {
              return done(null, false, { message: 'Incorrect username or password.'});
            }
        });            
        }
    })
  })
);

passport.use(new BasicStrategy(
  function(username, password, done) {
  var collection = db.collection("user")
    collection.find({"username" : username}).toArray(function(e, results) {
      if (e) { return done(err); }
      if (results.length == 0) {
        // user does not exist
        return done(null, false, { message: 'Incorrect username or password.' });
      } else {
        // incorrect password
        bcrypt.compare(password, results[0].password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
              return done(null, {});        
            } else {
              return done(null, false, { message: 'Incorrect username or password.'});
            }
        });            
        }
    })
  })
);

app.get('/user', passport.authenticate('basic',  {session:false}), function(req, res) {
  res.status(200).send()
})

app.post('/user', function(req, res) {
  var collection = db.collection("user")
  collection.find({"username" : req.body.user}).toArray(function(e, results) {
    if (e) return next(e)
  
    console.log(results)

    if (results.length === 0) {
      // username does not exist yet, insert it
        bcrypt.genSalt(5, function(err, salt) {
          if (err) return callback(err);

          bcrypt.hash(req.body.password, salt, null, function(err, hash) {
            if (err) return callback(err);
              
            collection.insert({username: req.body.user, password: hash}, {}, function(e, results){
              if (e) res.status(500).send()
              res.send(results)
            })
          });
        });
    } else {
      res.status(400).send({error:"usernameAlreadyExists"})
    }
  })
})

app.post('/candy', passport.authenticate('basic',  {session:false}), function(req, res) {
  var collection = db.collection("candy")

  collection.insert(req.body, {}, function(e, results){
    if (e) res.status(500).send()
    res.send(results) 
  })
})

app.get('/candy', passport.authenticate('basic',  {session:false}), function(req, res) {
  var collection = db.collection("candy")

  collection.find({} ,{}).toArray(function(e, results){
    if (e) res.status(500).send()
    res.send(results)
  })
})

app.listen(3000)
