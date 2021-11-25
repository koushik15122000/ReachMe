const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const session = require('express-session');

dotenv.config();

//REGISTER
router.post("/register",async (req,res)=>{
    
    try{
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //created new user
        const newUser = await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })

        //response
        const user= await newUser.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err)
    }
})

//LOGIN
router.post("/login", async (req,res)=>{

    try{
        //finding user by email
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(202).json("user not found");
        }

        //validating user password
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword){
            res.status(201).json("wrong password")
        }
        const token = jwt.sign(user.toJSON(),process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json(user)
    }catch(err){
        console.log(err);
    }
})


// router.get("/csrf",async(req,res)=>{
//     console.log(req.session.csrf)
//     try{
//         if(!req.session.csrf){
//         const rand = Math.random()
//         req.session.csrf=rand;
//         console.log(rand)
//         res.json(rand)}
//         else{
//             console.log("session already made")
//         }
//     }catch(err){
//         console.log(err)
//     }
// })

module.exports = router;