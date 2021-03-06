var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectID


module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}


            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    console.log(status);
                    if(status){
                        console.log('login sucess')
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login Failed');
                resolve({status:false})

            }

        })
    },
    addToCart:(proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})

            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==proId)
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                    {
                        $inc:{'products.$.quantity':1}
                    }
                    ).then(()=>{
                        resolve()
                    })
                }else{
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                {
                        $push:{products:proObj}
                }
                ).then((response)=>{
                    resolve()
                })
            }
            }else{
                let cartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
            ]).toArray()
            resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart){
                let loopStoper=cart.products.length
                for(i=0;i<loopStoper;i++){
                    count=cart.products[i].quantity+count
                }
            }
            resolve(count)
        })
    },
    changeProductCount:(details)=>{
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)

        return new Promise(async(resolve,reject)=>{
            if(details.count==-1 && details.quantity==1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:objectId(details.cart)},
                    {
                       $pull:{products:{item:objectId(details.product)}}
                    }
                    ).then((response)=>{
                        resolve({removeProduct:true})
                    })
                }else{
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
                    {
                        $inc:{'products.$.quantity':details.count}
                    }
                    ).then((response)=>{
                        resolve({status:true})
                    })
                }
        })
    },
    Removefromcart:(details)=>{
        details.quantity=parseInt(details.quantity)

        return new Promise(async(resolve,reject)=>{   
        db.get().collection(collection.CART_COLLECTION)
        .updateOne({_id:objectId(details.cart)},
        {
           $pull:{products:{item:objectId(details.product)}}
        }
        ).then((response)=>{
            resolve({removeProduct:true})
        })
    })
    },
    getCartPrice:(userId)=>{
        return new Promise(async(resolve,reject)=>{

            let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    $group:{

                        _id:null,
                        total:{$sum:{$multiply:['$quantity','$product.Price']}}
                    }
                }
            ]).toArray()
            resolve(total[0].total)
        })
    },
    loginAd:(data)=>{
        return new Promise(async(resolve,reject)=>{

            let loginStatus=false
            let response={}
    
    
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:data.Email})
            if(admin){
                bcrypt.compare(data.Password,admin.Password).then((status)=>{
                    console.log(status);
                    if(status){
                        console.log('login sucess')
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login Failed');
                resolve({status:false})
    
            }
            })
    },
    signupAd:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.Password=await bcrypt.hash(data.Password,10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(data).then((data)=>{
                resolve(data.ops[0])
            })
        })
    }
}  
