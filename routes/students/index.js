var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
var User = require('../../models/users');
var Student = require('../../models/students');

router.get('/', function(req, res){
  if(req.session.user){
    Student.find(function(err, students){
      res.render('students', {students : students, user: req.session.user});
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', function(req, res){
  console.log(req.body);
  var errors = [];
  Student.findOne({name: req.body.name}, function(err, student){
    if(student){
      errors.push('Student already exists');
    } else if (!student){
      // Validating the Form:

      // Failure conditions
      if(!req.body.name || !req.body.phoneNumber){
        errors.push("All fields are required");
      } else if (req.body.phoneNumber.length < 10){
        errors.push("Please provide a 10-digit phone number");
      } else if (req.body.phoneNumber != Number(req.body.phoneNumber)){
        errors.push("Please enter the phone number with numbers only (no special characters are permitted)");
      }

      // Success conditions
      if(req.body.name.length > 0 && req.body.phoneNumber.length >= 10 && req.body.phoneNumber == Number(req.body.phoneNumber)){
        Student.create(req.body, function(err, student){
          res.redirect('/students');
        });
      }
    }
    // Rerender new student form with errors if any errors are found
    if(errors.length){
      res.render('students/new', {errors : errors});
    }
  })
})

router.get('/new', function(req, res){
  res.render('students/new', {user: req.session.user});
});

router.get('/:id', function(req,res){
  console.log(req.params.id);
  Student.findOne({_id:req.params.id}, function(err, student){
    res.render('students/show', {student:student, user:req.session.user});
  })
})

module.exports = router;
