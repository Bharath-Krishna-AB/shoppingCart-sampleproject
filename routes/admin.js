var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })
});
router.get('/add-products',function(req,res){
  res.render('admin/add-products')
})
router.post('/add-products',function(req,res){
  productHelper.addProduct(req.body,(result)=>{
    res.render('/admin/view-products')
  })
})

module.exports = router;
