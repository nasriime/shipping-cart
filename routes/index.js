const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');

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
  var productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {} );
  Product.findById(productId,function(err,product){
    if (err) {return res.redirect('/');}
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart)
    res.redirect('/');
  })
})

module.exports = router;
