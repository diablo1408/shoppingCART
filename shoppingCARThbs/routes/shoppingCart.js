const express = require('express')
const route = express.Router()
const passport = require('../passportWork/setuppassport')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var Cart = require('./cartOperations')
const Product = require('./db').Product
const path = require('path')
route.use('/', express.static(path.join(__dirname, 'public')))


route.get('/cart/:id', (req, res) => {

     var cart = new Cart(req.session.cart ? req.session.cart : {})

    Product.findOne({

        where: {
            id: req.params.id
        }

    })
        .then((product) => {
             console.log("in then of cart:id" + req.params.id);
             console.log("product in then of cart");
             
             console.log(product);
             console.log("id before sending to add is::" +product.id);
             

            cart.add(product, product.id)
             console.log("after coming back from operations :"+cart);
            
            req.session.cart = cart;
            console.log("data in req.session.cart="+req.session.cart);
            
            res.redirect('/');

          

        })
        .catch((err) => {
            console.log("inside error  of :id" + req.params.id);

            res.status(500).send({ error: err })
        })
})

route.get('/shopping-cart',
ensureLoggedIn('/users/login') ,
function(req, res, next) {
    if (!req.session.cart) {
        console.log("not having the session");
        
        return res.render('shopping-cart', {products: null});
    } 
     var cart = new Cart(req.session.cart);
     console.log("cart coming from session");
     
     console.log(cart);
    
     console.log("cart changed into array");

     console.log(cart.generateArray());
     
     
     res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
 });

 
 route.get('/checkout',  function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    // var errMsg = req.flash('error')[0];
    res.render('checkout', {total: cart.totalPrice});
});

exports = module.exports = {
    route
}