const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//UPDATE USER
router.put("/:id", async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){

        //hashing the new password
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            }catch(err){
                return res.status(500).json(err)
            }
        }

        //updating everything in database
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set: req.body})
            res.status(200).json("Account has been updated")
        }catch(err){
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("you can update only your account");
    }
})


//DELETE USER
router.delete("/:id", async (req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin)
    {

        //deleting the user
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }catch(err){
            return res.status(403).json("you can delete only your account")
        }
    }else{
        return res.status(403).json("you can delete only your account");
    }
})


//GET A USER
router.get("/", async (req,res)=>{
    const username = req.query.username;
    const userId = req.query.userId;
    //fetching the user data
    try{
        const user = userId ? await User.findById(userId): await User.findOne({username:username});
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err)
    }
})


//GET ALL USERS
router.get("/all", async (req,res)=>{
    try{
        const user = await User.find({});
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err)
    }
})

//GET FRIENDS
router.get("/friends/:id",async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const friends = await Promise.all(
            user.followings.map(async(friendId)=>{
                return await User.findById(friendId)
            })
        )
        const friendList = friends.map((friend) => ({
            _id: friend?._id,
            username: friend?.username,
            profilePicture: friend?.profilePicture,
        }));
        res.status(200).json(friendList)
    }catch(error){
        res.status(500).json(error)
    }
})


//FOLLOW A USER
router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            //checking if the user already follows the desired user
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers: req.body.userId}});
                await currentUser.updateOne({$push: {followings: req.params.id}});
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("you already follow this user");
            }

        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you cant follow yourself")
    }
})


//UNFOLLOW A USER
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            //checking if the user already follows the desired user
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers: req.body.userId}});
                await currentUser.updateOne({$pull: {followings: req.params.id}});
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("you dont follow this user");
            }
            
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you cant unfollow yourself")
    }
})


module.exports = router;