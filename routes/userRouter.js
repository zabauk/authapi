const router=require('express').Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/Usermodel')
const Auth=require('../middlewares/auth')

//register router
router.post('/register', async(req, res)=>{
    try{
        const {email, password, passwordcheck, firstname, lastname}=req.body

        //validation empty field
        if(!email || !password || !passwordcheck || !firstname || !lastname){
            res.status(400).json({
                msg: 'no all fields have been entered'
            })
        }

        //check password length
        if(password.length <6){
            return res.status(400).json({
                msg: 'the password need to be at least 6 characters long'
            })
        }


        //check email unique
        const existingEmail=await User.findOne({email: email})
        if(existingEmail){
            return res.status(400).json({
                msg: 'Email already exist'
            })
        }

        //check password match
        if(password!=passwordcheck){
            return res.status(400).json({
                msg: 'password don\'t match'
            })
        }

        //hash password for security 
        const salt=await bcrypt.genSalt(10)
        const passwordHash=await bcrypt.hash(password, salt)

        //save user to database
        const newUser=new User({
            email: email,
            password: passwordHash,
            firstname: firstname,
            lastname: lastname
        })

        const savedUser=await newUser.save()
        res.json(savedUser)

    }catch(err){
        res.status(500).json({err: err.message})
    }
})

//login Router
router.post('/login', async(req, res)=>{
    try{
        const {email, password}=req.body
        //validate empty field
        if(!email || !password){
            return res.status(400).json({msg: 'Fill all fields'})
        }
        //check email exist
        const user=await User.findOne({email: email})
        if(!user){
            return res.status(400).json({msg: 'User dones not exist'})
        }

        //checking password
        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({msg: 'Invalid credentials'})
        }

        //create json web token
        const token=jwt.sign({id:user._id}, process.env.AUTH_SECRET_TOKEN)
        res.json({
            token,
            user:{
                id:user._id,
                firstname:user.firstname,
                lastname:user.lastname,
                email:user.email,
            }
        })

    }catch(err){
        res.status(500).json({err: err.message})
    }
})

//delete user account
router.delete('/delete', Auth, async(req, res)=>{
    try{
        const deleteUser=await User.findByIdAndDelete(req.user)
        res.json(deleteUser)
    }catch(error){
        res.status(500).json({msg:error.message})
    }
})

module.exports=router
