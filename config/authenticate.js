//check session
var checked =(req,res,next)=>{
  if(req.session.uid){
    console.log('next work')
      next();
  }else{
      res.redirect('/user/login');
  }
}

module.exports = checked;