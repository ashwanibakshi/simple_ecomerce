const express       = require('express');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const conn          = require('./config/data').con;
const path          = require('path');
const session       = require('express-session');


//connect to mongodb
mongoose.connect(conn,{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('error occur',err))

//app init
const app = express();

//set template engine
app.set('view engine','ejs');

//bodyparser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//public folder path
app.use(express.static(path.resolve(__dirname,'public')));

//session
app.use(session({
      secret:'thisISmySECRETKEY1234',
      resave:false,
      saveUninitialized:false
 })
);

//set locals variable
app.use((req,res,next)=>{
       res.locals.role = req.session.role;
       next();
});

//default page load
app.get('/',(req,res)=>{
     res.redirect('/product/index');
}); 

//routing
app.use('/product',require('./routes/product'));
app.use('/user',require('./routes/user'));

const port = process.env.port || 3000;
app.listen(port,()=>console.log('server run at port '+port));