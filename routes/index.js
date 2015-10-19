var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
var User = require('../models/users');
var Student = require('../models/students');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', function(req, res){
  var errors = [];
  User.findOne({email: req.body.email}, function(err, user){
    console.log("Found the user you were looking for:", user);
    if(!bcrypt.compareSync(req.body.password, user.passwordDigest)){
      errors.push('Incorrect username/password');
    }
    // User exists. Compare hashed password with passwordDigest.
    if(bcrypt.compareSync(req.body.password, user.passwordDigest)){
      // Passwords match.  Set the session and redirect to /students.
      req.session.user = user.email
      res.redirect('/students');
    }

    if(errors.length){
      res.render('login', {errors: errors});
    }
  })
})

router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  var errors = [];
  User.findOne( {email: req.body.email}, function(err, user){
    if(user){
      console.log("I found a user in the DB", user);
      errors.push("User already exists");
    }
    else if (!user){
      console.log("No user found!");
      // Failure conditions
      if(!req.body.email || !req.body.password || !req.body.passwordConfirm){
        errors.push("All fields are required");
      } else if (req.body.password !== req.body.passwordConfirm){
        errors.push("Passwords do not match");
      }
      // Succcess conditions
      if(req.body.email.length > 0 && req.body.password == req.body.passwordConfirm){
        var hash = bcrypt.hashSync(req.body.password, 10);
        User.create( {email: req.body.email, passwordDigest: hash}, function(err, user){
          console.log("This is the newly created user", user);

          req.session.user = user;
          res.render('students', {user : req.session.user});
        });
      }
    }

    if(errors.length){
      res.render('register', {errors : errors});
    }
  });
});

router.get('/logout', function(req, res){
  req.session = null;
  res.redirect('/login');
});

module.exports = router;
