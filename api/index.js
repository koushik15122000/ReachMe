const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const userRoute =  require('../api/routes/users');
const authRoute = require("../api/routes/auth");
const postRoute = require("../api/routes/post");
const conversationRoute =  require('../api/routes/conversation');
const messageRoute = require('../api/routes/message');
const multer = require('multer');
const path = require('path');
const app=express();
const jwt=require('jsonwebtoken');
// const session = require('express-session');


dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true , useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false},()=>{
    console.log("database running")
})

app.use("/images",express.static(path.join(__dirname,"/public/images")))

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/images")
    }, 
    filename:(req,file,cb)=>{
        cb(null,req.query.name)
    }
})

const upload = multer({storage:fileStorage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("file uploaded succesfully")
    }catch(err){
        console.log(err)
    }
})

function authenticateToken (req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403)
        req.user = user
        next()
    })
}

// const rand = Math.random();
// function csrf (req,res,next){
//     req.rand=rand
//     next()
// }
// app.use(session({secret: 'ssshhhhh', resave:false , saveUninitialized:false}));

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.use("/api/conversation",conversationRoute);
app.use("/api/message",messageRoute);

app.listen(8800,()=>{
    console.log("backend running");
})