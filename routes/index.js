const express = require('express');
const router = express.Router();
const Product = require('../models/product');

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

router.get('/add-to-cart/:id',function(req, res, next){
  
})

module.exports = router;
