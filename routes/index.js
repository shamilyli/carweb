var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/carweb');  //specify db


var userSchema = {
  firstname: String,
  lastname: String
}

var users = mongoose.model('users', userSchema, 'user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'carweb', author: 'JH' });
});

/* GET users page. */
router.get('/users', function(req, res, next) {
  users.find().exec(function(err, doc) {   //err is 1 or 2, doc is data retrieved from db
    //res.send(doc);  //send: directly send some string, doesn't convert to some HTML template
    //});
    res.render('users', {title: 'All users', users: doc});
  });
});

/* POST add student. */
router.post('/users/add', function(req, res, next) {
  var newUser = new users(req.body);
  newUser.save(function (err, doc) {
    res.render('userDetail', {user: doc});
  });
});

/* GET add user form */
router.get('/users/add', function(req, res, next) {
  res.render('newUser', {user: {}, action: '/users/add', title: 'Add New User'});
});

/* GET user object and insert it into update form */
router.get('/users/update/:id', function(req, res, next) {
  Students.findById(req.params.id).exec(function(err, doc) {
    res.render('newUser', {user: doc, action: '/users/update/' + doc._id, title: 'Update User Info'});
  });
});

/* POST user object to current object in database */
router.post('/users/update/:id', function(req, res, next) {
  //console.log(req.body);  //req.body shouldn't have an id
  // var userObj = req.body;       //these two lines are just showing how to add id to form
  // userObj._id = req.params.id;  //params.id == :id
  //console.log(userObj);
  users.update({_id: req.params.id}, {$set: req.body}).exec(function(err, doc) {
    //console.log(doc) {
    if (err) {
      // handle err
    } else {
      //res.send(req.body);
      res.redirect('/users/' + req.params.id); //redirect to userDetail page to reuse router
    }
    //};
  });
});

/* GET remove user by id. */
router.get('/users/remove/:id', function(req, res, next) {
  users.remove({_id: req.params.id}, function(err, doc) {
    if (err) {
      //handle err
    } else {
      res.redirect('/users');  //fetch all users again except for the deleted entry
    }
  })
});

/* GET user detail by id. */
router.get('/users/:id', function(req, res, next) {
  //res.send(req.params.id);  //eg. http://localhost:3000/users/1, page displays 1
  users.findById(req.params.id).exec(function(err, doc) {
    //res.send(doc);  //display json string
    res.render('userDetail', {student: doc});
  });
});


/* POST a search/read request, one of CRUD (here, find user by name). */
router.post('/users/search', function(req, res, next) {
  //console.log(req.body.firstname);
  users.find({'firstname': req.body.firstname}).exec(function(err, doc) {
    if (err) {  //db not connected, no matching result, syntax error
      //handle error
    } else {
      res.render('users', {title: 'Search Results', users: doc});
    }
  });
});



module.exports = router;
