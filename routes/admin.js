var express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
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
    res.redirect('/admin')
  })
})

router.get('/delete-products/',(req,res)=>{
let prodId=req.query.id
productHelpers.deleteProducts(prodId).then((response)=>{
  res.redirect('/admin')
})
})

module.exports = router;
