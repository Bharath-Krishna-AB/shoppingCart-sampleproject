const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
var userHelpers=require('../helpers/userhelpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products,user})
  })
});

router.get('/login', function(req, res, next) {
res.render('user/login')
});

router.get('/signup', function(req, res, next) {
  res.render('user/signup')
  });

  router.post('/signup', function(req, res, next) {
    userHelpers.doSignup(req.body).then((response)=>{
      console.log(response)
    })
    });

    router.post('/login', function(req, res, next) {
      userHelpers.doLogin(req.body).then((response)=>{
        if(response.status){
          req.session.loggedIn=true
          req.session.user=response.user
          res.redirect('/')

        }else{
          res.redirect('/login')
        }
      })
      });
      router.get('/logout',(req,res)=>{
        req.session.destroy()
        res.redirect('/')
      })



module.exports = router;
