const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products})
  })
});

router.get('/login', function(req, res, next) {
res.render('user/login')
});



module.exports = router;
