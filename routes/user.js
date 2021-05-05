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
router.get('/',async function (req, res, next) {
  let user=req.session.user
  let cartCount=null
  if(req.session.user){
  cartCount=await userhelpers.getCartCount(req.session.user._id)
  }
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products,user,cartCount})
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
        let user=req.session.user._id
        let cartCount=null
        if(req.session.user){
          cartCount=await userhelpers.getCartCount(req.session.user._id)
          }let totalval="0"
          if(cartCount){
          totalval =await userhelpers.getCartPrice(req.session.user._id)
          }
          let products=await userhelpers.getCartProducts(req.session.user._id)
        res.render('user/Cart',{products,user,cartCount,totalval})
      })

      router.get('/addToCart/:id',(req,res)=>{
        userhelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
          res.json({status:true})
        })
      })

      router.post('/changeProductQuantity',(req,res)=>{
        userhelpers.changeProductCount(req.body).then(async(response)=>{
          if(response.removeProduct){
            console.log('continue');
          }else{
          response.total =await userhelpers.getCartPrice(req.body.user)
          }
          res.json(response)
        })
      })
      router.post('/removeProFromCart',(req,res)=>{
        userhelpers.Removefromcart(req.body).then((response)=>{
          res.json(response)
        })
      })
      router.get('/place-order',verifyLogin,async(req,res)=>{
        let total =await userhelpers.getCartPrice(req.session.user._id)
        let user=req.session.user
        res.render('user/place-order',{total,user})
      })

      router.get('/place-order',(req,res)=>{
        console.log(req.body);
      })
      module.exports = router;
