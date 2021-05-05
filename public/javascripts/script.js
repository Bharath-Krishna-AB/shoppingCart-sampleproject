function addToCart(proId){
    $.ajax({
      url:'/addToCart/'+proId,
      method:'get',
      success:(response)=>{
          if(response.status){
              let count=$('#cart-Count').html()
              count=parseInt(count)+1
              $("#cart-Count").html(count)
          }
      }
    })
  }

  function changeQuantity(cartId,proId,userId,count){
    let status=true
    let quantity=parseInt(document.getElementById(proId).innerHTML)
    count=parseInt(count)
    $.ajax({
      url:'/changeProductQuantity',
      data:{
        user:userId,
        cart:cartId,
        product:proId,
        count:count,
        quantity:quantity
      },
      method:'post',
      success:(response)=>{
        if(response.status){
          let val=$('#cart-Count').html()
          val=parseInt(val)+count
          $("#cart-Count").html(val)
      }else{
        console.log('error');
      }
        if(response.removeProduct){
          alert('are you sure?')
          location.reload()
        }else{
          document.getElementById(proId).innerHTML=quantity+count
          document.getElementById('total').innerHTML=response.total
        }
      }
    })
}
function removeFromCart(cartId,proId){
  $.ajax({
    url:'/removeProFromCart',
    data:{
      cart:cartId,
      product:proId,
    },
    method:'post',
    success:(response)=>{
      if(response.removeProduct){
        alert('are you sure?')
        location.reload()
      }
    }
  })
}

