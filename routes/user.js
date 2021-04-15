const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
var userHelpers=require('../helpers/userhelpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products})
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
      userHelpers.doLogin(req.body)
      });



module.exports = router;
