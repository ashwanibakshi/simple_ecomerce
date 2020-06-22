const express      = require('express');
const itemsModel   = require('../models/items');
const cartModel    = require('../models/cart');
const multer       = require('multer');
const checked      = require('../config/authenticate');
const auth         = require('../config/authorization').authorize;

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/uploads')
  },
  filename:function(req,file,cb){
     cb(null,file.originalname)
  }
});

const uploads = multer({storage:storage});

const router  = express.Router();

//----------------- default start page --------------//
router.get('/index',(req,res)=>{
  console.log('sdsdf')
  var page = 1;
  var perPage = 6;
  var query = {};
  if(req.query.page){
    page = req.query.page;
  }
  query.skip  = perPage*(page-1);
  query.limit = perPage;
  itemsModel.find({},{},query,(err,itemData)=>{
    if(err){
      console.log(err);
    }else{
      itemsModel.count((err,itemCount)=>{
        console.log('itemdata',itemData)
        res.render('pages/index',{data:itemData,
          current:page,
          pages:Math.ceil(itemCount/perPage)
        }); 
      });
    } 
  });
});
//------------------- end default page ---------------//

//------------------- add product --------------------//
router.get('/addItem',checked,auth('admin'),(req,res)=>{
  console.log('session',req.session.uid)
   res.render('pages/additem');
});

router.post('/addItem',uploads.array('pic'),checked,auth('admin'),(req,res)=>{
  try {
    const picpath1 = '/uploads/'+req.files[0].originalname;
    const picpath2 = '/uploads/'+req.files[1].originalname;
    const picpath3 = '/uploads/'+req.files[2].originalname;
     console.log(req.files);
     const item = new itemsModel({
           pic1: picpath1,
           pic2: picpath2,
           pic3: picpath3,
          brand: req.body.brand,
       itemName: req.body.prodname,
          color: req.body.color,
           desc: req.body.desc,
          price: req.body.price,
       dealerId: req.session.uid,
       category: req.body.category
     });
     item.save((err,data)=>{
        if(err){
          console.log(err)
        }else{
          // res.json({da:data,msg:'data added'});
          res.render('pages/additem');
        }
     });
  } catch (error) {
     console.log('error',error);
  }
});

//----------------- end add product ----------------//

//----------------- edit/update product ------------------//
router.get('/editItem/:id',checked,auth('admin'),(req,res)=>{
  try {
    itemsModel.find({_id:req.params.id},(err,itemData)=>{
      if(err){
       console.log('error',err);
      }else{
        res.render('pages/edititem',{data:itemData});
      }
 }); 
  } catch (error) {
    console.log('edit product errror',error);
    //  res.json({err:error})
  }
});

//update product
router.post('/editItem',checked,auth('admin'),(req,res)=>{
  try {
    console.log(req.body);

    const item = {
      itemName: req.body.prodname,
         brand: req.body.brand,
         price: req.body.price,
          desc: req.body.desc,
         color: req.body.color,
      category: req.body.category
    }

    itemsModel.update({'_id':req.body.id},{$set:item},(err,data)=>{
        if(err){
          console.log(err);
        }else{
          // res.json({da:data});
          res.redirect('/product/showItem');
        }
    });

  } catch (error) {
    // res.json({err:error})
    console.log('error',err);
  }
});
//--------------- end edit/update product ---------------//

//---------------- delete product ----------------------//
router.get('/deleteItem/:id',checked,auth('admin'),(req,res)=>{
  try {
    itemsModel.deleteOne({'_id':req.params.id},(err,data)=>{
      if(err){
        console.log(err);
      }else{
         res.redirect('/product/showItem');
      } 
    });
  } catch (error) {
    console.log('errr',error);
  }
});

//------------------- end delete ----------------------//

//---------------------- show item --------------------//
router.get('/showItem',checked,auth('admin'),(req,res)=>{
  var page  = 1;
  var perPage = 6;
  var query = {};
  if(req.query.page){
    page = req.query.page;
  }
   query.skip  = perPage*(page-1);
   query.limit = perPage;

  itemsModel.find({},{},query,(err,itemData)=>{
     if(err){
       console.log(err);
     }else{
       itemsModel.count((err,countData)=>{
        if(err){
          console.log(err);
        }else{
          res.render('pages/showitem',{
            data:itemData,
            current:page,
            pages:Math.ceil(countData/perPage)
          });
        }
       });
     }
  });
});

//------------------- end show Item ------------------//

//--------------------- item details ----------------//
router.get('/productDetails/:id',(req,res)=>{
  console.log('parameter',req.params.id)
  itemsModel.find({'_id':req.params.id},(err,itemDetails)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render('pages/itemDetail',{data:itemDetails});
      }
  });
});
//------------------- end item details -------------//

//------------------- cart ------------------------//
router.get('/cart',checked,auth('customer'),(req,res)=>{
 var perPage = 2;
 var page  = 1;
 if(req.query.page){
   console.log('page',req.query.page);
   page=req.query.page;
 }
  cartModel.aggregate([
    {"$skip":perPage*(page-1)},
    {"$limit":perPage},
    {
    $lookup:{
      from:'items',
      localField:'pid',
      foreignField:'_id',
      as:'cartItem'
    } 
  }],(err,cartData)=>{
     if(err){
       res.json({msg:'error occured'});
     }
     else{
       console.log('cartdata',cartData);
       cartModel.count((err,cartItemCount)=>{
         if(err){
           res.json({msg:'error'});
         }
         else{
           console.log('count',cartItemCount)
          res.render('pages/cartitem',{data:cartData, current:page,
          pages:Math.ceil(cartItemCount/perPage)});      
         }
       });  
     }
    });
});

//update cartItem
router.post('/cartUpdate',(req,res)=>{
   console.log('pid',req.body.id,req.body.quantity);
   var upItems = {
     quantity:req.body.quantity
   }
   cartModel.updateOne({'_id':req.body.id},{$set:upItems},(err,cartItems)=>{
    if(err){
      res.json({msg:'failure'});
    }else{
      console.log('success',cartItems)
      res.json({msg:'success'})
    }
   });
});

//delete cartItem
router.post('/cartDeleteItem',(req,res)=>{
     try {
       cartModel.deleteOne({'_id':req.body.id},(err,cartData)=>{
          if(err){
            res.json({msg:'failure'});
          }else{
            res.json({msg:'success'});
          }
       });
     } catch (error) {
       res.json({msg:'failure'});
     }
});


//add items to cart
router.post('/addToCart',(req,res)=>{
  try {
    var qtyy = 1;
    console.log('sd',req.body.id);
    if(req.session.uid){

   //check it item already in cart
    cartModel.find({'pid':req.body.id},{'cid':req.session.uid},(err,cartData)=>{
       if(err){
         res.json({msg:'failure',data:'some error occured'});
       }
       else{
         if(cartData.length>0)
         {
           console.log('cart data',cartData);
           res.json({msg:'failure',data:'item already in cart'});
         }
         else{
           if(req.body.qty){
             qtyy = req.body.qty;
           }
          var cartItem = new cartModel({
             cid:req.session.uid,
             pid:req.body.id,
             quantity:qtyy
          });
          cartItem.save((err,data)=>{
             if(err){
               console.log('error',err);
              res.json({msg:'failure',data:'item  not added to cart,try Again'});
             }
             else{
              res.json({msg:'success',data:'data added to cart'});
             }
          });
         }
       }
    });
  }else{
    res.json({msg:'failure',data:'login first'});
  }
 } catch (error) {
    console.log('ERRORS',error);
  }
});


//search item
router.get('/searchItem',(req,res)=>{
   console.log('dfdf',req.session.item);

      if(req.query.finditem){
        req.session.item = req.query.finditem;
      }

  var page    = 1;
  var perPage = 3;
  if(req.query.page){
    page = req.query.page;
}
  var query   = {};
  query.skip  = perPage*(page-1);
  query.limit = perPage;
 
   console.log('session_ID',req.session.item);
   itemsModel.find({category:req.session.item},{},query,(err,searchData)=>{
     if(err){
       console.log('search error',err);
     }else{
        itemsModel.count((err,itemCount)=>{
          if(err){
            console.log('count error',err);
          }else{
            console.log('data',searchData)
            res.render('pages/searchitems',{
              data:searchData,
              current:page,
              pages:Math.ceil(itemCount/perPage),
              page_name: req.session.item
            });
          }
        });  
     }
   });
});

//------------------ end cart --------------------//

module.exports = router;