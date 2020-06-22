$(function(){
    
//------------------- cart ----------------------//
    $('.shopBtn').click(function(){
        var pid = $(this).closest('.cntr').find('.pid');
        var qtyy = $('#qty').val();
    
        if(qty!=null || qty!=undefined){
          var pidd = $('.pid').val();
          $.ajax({
              url:'/product/addToCart',
              type:'post',
              dataType:'JSON',
              data:{id:pidd,qty:qtyy},
              success:function(data){
                  if(data.msg=='success'){
                      alert(data.data);
                  }else{
                      alert(data.data);
                  }
              },
              error:function(){
                  alert('server error occured')
              }
          })
        }else{
        $.ajax({
            url:'/product/addToCart',
            type:'post',
            dataType:'JSON',
            data:{id:pid.val()},
            success:function(data){
                if(data.msg=='success'){
                    alert(data.data);
                }
                else if(data.msg=='failure'){
                     alert(data.data);
                }
            },
            error:function(){
             alert('server error occured');
            }
        });
       }
    });
 
    $('.minus').click(function(){
        //item quantity
        var x = $(this).closest('tr').find('.quant');

        //item id
        var itemid = $(this).closest('tr').find('.itemid');

        if(x.val()>1){
        //new quantity
        var newQuant = x.val()-1;

         //unitprice
         var totPrice = $(this).closest('tr').find('.unitPrice');
         var price = totPrice.text();
         var storePrice = price.split('.');
 
         //totalprice
         var tot = $(this).closest('tr').find('.totPrice');

        $.ajax({
            url:'/product/cartUpdate',
            type:'post',
            dataType:'JSON',
            data:{'id':itemid.val(),'quantity':newQuant},
            success:function(data){
               if(data.msg=='success'){
                     x.val(newQuant)
                     var pricee =  storePrice[1]*newQuant;
                     tot.text('Rs.'+pricee);
               }
            } 
        });
      }
    });
   
    $('.plus').click(function(){
        //item quantity
        var x = $(this).closest('tr').find('.quant');
        
        //item id
        var itemid = $(this).closest('tr').find('.itemid'); 

        //new quantity
        var newQuant = Number(x.val()) + 1;

        //unitprice
        var totPrice = $(this).closest('tr').find('.unitPrice');
        var price = totPrice.text();
        var storePrice = price.split('.');

        //totalprice
        var tot = $(this).closest('tr').find('.totPrice');
        
        
        //update data on pluse icon click
        $.ajax({
            url:'/product/cartUpdate',
            type:'post',
            dataType:'JSON',
            data:{'id':itemid.val(),'quantity':newQuant},
            success:function(data){
               if(data.msg=='success'){
                   x.val(newQuant);
                   var pricee =  storePrice[1]*newQuant;
                   tot.text('Rs.'+pricee);
               }
            }, 
            error:function(){
              alert('server error occured');
            }
        });
    });
   
    $('.danger').click(function(){
        //item_id
        var x = $(this).closest('tr').find('.itemid');
        var itemId = x.val();
        alert('itemid'+itemId);

        $.ajax({
            url:'/product/cartDeleteItem',
            type:'post',
            dataType:'JSON',
            data:{'id':itemId},
            success:function(data){
                if(data.msg=='success'){
                    window.location.href ='/product/cart';
                }
            },
            error:function(){
                alert('server error occured');
            }
        });        
    });
//------------------ end cart ----------------------//

});
