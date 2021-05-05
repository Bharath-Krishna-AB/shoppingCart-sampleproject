var express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
const userhelpers = require('../helpers/userhelpers');

const verifyadminLogin=(req,res,next)=>{
  if(req.session.admin.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })
});
router.get('/add-products',verifyadminLogin,function(req,res){
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

router.get('/adminlogin', function(req, res, next) {
  if(req.session.admin){
    res.redirect('/login')
  }else{
    let loginErr=req.session.adminLoginErr
res.render('/admin',{loginErr})
req.session.userLoginErr=false
  }
});

router.post('/login', function(req, res, next) {
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      
      req.session.admin=response.admin
      req.session.admin.loggedIn=true
      res.redirect('/')

    }else{
      req.session.userloginErr=true
      res.redirect('/login',)
    }
  })
  })

module.exports = router;
