var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
const userhelpers = require('../helpers/userhelpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let Admin =req.session.admin
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products,Admin})
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

router.get('/AdminLogout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
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

router.get('/LoginAdmin',(req,res)=>{
  if(req.session.LogIn){
    res.redirect('/admin')
  }else{
  res.render('admin/adminLogin')
  }
  
})

router.post('/LoginAdmin',(req,res)=>{
  userhelpers.loginAd(req.body).then((response)=>{
    if(response.status){    
      req.session.LogIn=true
      req.session.admin=response.admin  
      res.redirect('/admin')
    }else{
      res.redirect('/admin/adminLogin')
    }
  })
 
})

router.get('/SignupAdmin0224',(req,res)=>{
  res.render('admin/adminSignup')
})

router.post('/SignupAdmin0224',(req,res)=>{
  userhelpers.signupAd(req.body).then((response)=>{
    res.redirect('/admin/SignupAdmin0224')
  })
})

module.exports = router;
