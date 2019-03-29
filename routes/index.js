const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const csrf = require('csurf');

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
  res.render('user/signup',{ csrfToken: req.csrfToken })
});

router.post('/user/signup', function(req, res, next) {
  res.redirect('/')
});

module.exports = router;
