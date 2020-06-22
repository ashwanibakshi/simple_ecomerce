const userModel = require('../models/user');

module.exports.authorize = (role)=>{
    return (req,res,next)=>{
         if(req.session.uid){
              userModel.find({'_id':req.session.uid},{'role':role},(err,userData)=>{
                if(err){
                    console.log(err);
                }else{
                    if(userData){
                        next();
                    }else{
                         res.render('pages/register');
                    }
                }
              });
         }
         else{
             res.render('pages/register');
         }
    }
}