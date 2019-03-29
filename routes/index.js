const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const csrf = require('csurf');
const passport =require('passport');

const csrefProtection = csrf();
router.use(csrefProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find((err,docs)=>{
    let productsChunk = [];
    const chunkSize = 3;

    for(let i=0; i< docs.length; i += chunkSize ){
      productsChunk.push(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', { title: 'Express', productsChunk });
  })

});

router.get('/user/signup', function(req, res, next) {
  var messages = req.flash('error')
  res.render('user/signup',{ csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0 })
});

router.post('/user/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));


router.get('/user/profile', function(req, res, next) {
  res.render('user/profile',{ csrfToken: req.csrfToken })
});

module.exports = router;
