const { response } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers');
const userhelpers = require('../helpers/userhelpers');
var userHelpers=require('../helpers/userhelpers')

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products,user})
  })
});

router.get('/login', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
res.render('user/login',{'loginErr':req.session.loginErr})
req.session.loginErr=false
  }
});

router.get('/signup', function(req, res, next) {
  res.render('user/signup')
  });

  router.post('/signup', function(req, res, next) {
    userHelpers.doSignup(req.body).then((response)=>{
      req.session.loggedIn=true
      req.session.user=response
      res.redirect('/')
    })
    });

    router.post('/login', function(req, res, next) {
      userHelpers.doLogin(req.body).then((response)=>{
        if(response.status){
          req.session.loggedIn=true
          req.session.user=response.user
          res.redirect('/')

        }else{
          req.session.loginErr=true
          res.redirect('/login',)
        }
      })
      });
      router.get('/logout',(req,res)=>{
        req.session.destroy()
        res.redirect('/')
      })

      router.get('/Cart',verifyLogin,async(req,res,)=>{
        let products=await userhelpers.getCartProducts(req.session.user._id)
        let number=1
        res.render('user/Cart',{products,number})
        console.log(products);
      })

      router.get('/addToCart/:id',verifyLogin,(req,res)=>{
        userhelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
          res.redirect('/')
        })
      })

      module.exports = router;
