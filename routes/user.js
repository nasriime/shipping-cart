const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const csrf = require('csurf');
const passport =require('passport');

const csrefProtection = csrf();
router.use(csrefProtection);


router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('user/profile',{ csrfToken: req.csrfToken })
  });

router.get('/logout',isLoggedIn,function(req,res,next){
    req.logOut();
    res.redirect('/');
})

router.use('/', notLoggedIn,function(req,res,next){
     next()
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error')
  res.render('user/signup',{ csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0 })
});

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin',function(req,res,next){
  var messages = req.flash();
  res.render('user/signin',{csrfToken: req.csrfToken(),messages,hasErrors: messages.length >0})
})

router.post('/signin', passport.authenticate('local.signin',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

router.get('/',function(req,res,next){
    req.logOut();
    res.redirect('/');
});


module.exports = router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/');
}

function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next()
    }
    res.redirect('/');
}
