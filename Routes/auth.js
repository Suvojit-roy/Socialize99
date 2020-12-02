const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=mongoose.model("User")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../config/keys')
const requirelogin=require('../middleware/requirelogin')


// router.get('/protected',requirelogin,(req,res)=>{
//     res.send("hello user")
// })

router.post('/signup',(req,res)=>{
    
   const {name,email,password,pic}=req.body

   if(!email || !password || !name)
   {
       res.status(422).json({error:"please add all the fields"})
   }


   User.findOne({email:email})
    .then((saveduser)=>{
        if(saveduser){
            res.status(422).json({error:"User already present"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                email,
                name,
                password:hashedpassword,
                pic
            })

            user.save()
            .then(user=>{
                res.json({message:"user saved"})
            })
            .catch(err=>{
                console.log(err);
            })
        })
        {}
        
    })
    .catch(err=>{
        console.log("error")
    })
    
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(saveduser=>{
        if(!saveduser){
            return res.status(422).json({error:"Invalid email or password"})
        }

        bcrypt.compare(password,saveduser.password)
        .then(doMatch=>{
            if(doMatch){
                // return res.json({message:"Sign in Successfull"})
                const token=jwt.sign({_id:saveduser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}=saveduser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })

    })
    
})

module.exports=router