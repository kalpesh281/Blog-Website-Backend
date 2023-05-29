const router=require("express").Router();
const Post = require("../models/Post");
const User=require("../models/User");
const bcrypt = require('bcrypt');


router.put("/:id",async(req,res)=>{
    if (req.body.userId==req.params.id) {
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt)
        }
        try {
            const updatedUser=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true})
            res.status(200).json(updatedUser)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(401).json("You Only Update Your Account")
    }
})


router.delete("/:id",async(req,res)=>{
    if (req.body.userId==req.params.id) {
          try {
            const user=await User.findById(req.body.id);
            try {
                await Post.deleteMany({username:user.username})
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("User has been Deleted..")

            } catch (error) {
                res.status(500).json(error)
            }
            
          } catch (error) {
            res.status(404).json("User not Found")
          } 
        }
     else {
        res.status(401).json("You Only Delete Your Account")
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        const{password,...other}=user._doc;
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports=router