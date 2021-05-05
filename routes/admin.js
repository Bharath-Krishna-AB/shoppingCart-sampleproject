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
  res.render('admin/add-products',{admin:true})
})
router.post('/add-products',function(req,res){
  productHelper.addProduct(req.body,(result)=>{
    res.redirect('/admin')
  })
})

router.get('/delete-products/',(req,res)=>{
let proId=req.query.id
productHelpers.deleteProducts(proId).then((response)=>{
  res.redirect('/admin')
})
})

router.get('/edit-products/:id',async (req,res)=>{
  let product=await productHelpers.getproductDetailes(req.params.id)
  res.render('admin/edit-products',{product,admin:true})
})

router.post('/edit-products/:id',(req,res)=>{
  productHelpers.updateProducts(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})

module.exports = router;
