const express   = require('express');
const userModel = require('../models/user');
const bcrypt    = require('bcryptjs');

const router = express.Router();

//---------------------- register -------------------------//

router.get('/register',(req,res)=>{
    res.render('pages/register');
});

router.post('/register',(req,res)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(req.body.password,salt,(err,hash)=>{
            if(err){
                console.log(err)
            }else{
                const userName = req.body.firstname+req.body.lastname
                const user = new userModel({
                    username : userName,
                    email    : req.body.email,
                    role     : req.body.role,
                    password : hash
                });

                user.save((err,data)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                    console.log('data',data);
                    //  res.json({da:data});
                    res.redirect('login');
                    }
                });
            }
        });
    });
});

//----------------------- end register --------------------//


//------------------------ login -------------------------//
router.get('/login',(req,res)=>{
  res.render('pages/login');
});

router.post('/login',(req,res)=>{
    try {

  userModel.find({'email':req.body.email},(err,userData)=>{
        if(err){
            console.log(err);
            res.json({msg:'server error occured'});
        }
        else{
            if(userData!=''){
         bcrypt.compare(req.body.password,userData[0].password,(err,match)=>{
            if(err){
                console.log(err);
            }
            else{
                if(match){
                  if(userData[0].role =='customer'){
                    req.session.uid  = userData[0]._id;
                    req.session.role = userData[0].role; 
                    res.redirect('/product/index');
                  }
                    else if(userData[0].role=='admin'){
                        req.session.uid  = userData[0]._id;
                        req.session.role = userData[0].role;
                        res.redirect('/product/addItem');
                    }
                }
                else{
                    res.json({msg:'username password didnt match'});
                }
            }
         });   
        }
        else{
             res.json({msg:'user is not registered'});
        }
    }
  });   
 } 
 catch (error) {
       res.json({error});      
  } 
});

//--------------------- end login ------------------------//

//----------------------- profile -----------------------//
router.get('/userprofile',(req,res)=>{
    try {
   userModel.find({'_id':req.body.id},(err,userData)=>{
         if(err)
         {
             console.log(err);
         }
         else
         {
             res.render('pages/profile');
         }
   });
  } 
  catch (error) {      
     res.json({error}); 
  }
});

router.post('/userprofile',(req,res)=>{
   const user = {
       username:req.body.username,
       email:req.body.email,
       password:req.body.password
   }
   userModel.update({'_id':req.body.id},{$set:user},(err,userData)=>{
      if(err){
          console.log(err);
      }
      else{
          res.redirect('user/userprofile');
      }
   });
});

//---------------------- end profile -------------------//

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/product/index');
});

module.exports = router;