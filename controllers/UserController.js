const User=require('../models/Usermodel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const multer=require('multer')

//get all users
exports.index=async(req, res)=>{
    try{
        const users=await User.find().select("firstname lastname email avatar")
        return res.json(users)
    }catch(err){
        res.status(500).json({msg: err.message})
    }
}

//register new user
exports.register=async(req, res)=>{
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
            lastname: lastname,
            avatar:req.file.path
        })

        const savedUser=await newUser.save()
        res.json(savedUser)

    }catch(err){
        res.status(500).json({err: err.message})
    }
}

//login user
exports.login=async(req, res)=>{
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
        res.cookie('token', token, {
            maxAge:24*60*60*1000
        })
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
}

//check tocken valid
exports.tokencheck=async(req, res)=>{
    try{
        const token=req.header('Authorization')
        if(!token){
            return res.json(false)
        }
        //verify token
        const verifytoken=jwt.verify(token, process.env.AUTH_SECRET_TOKEN)
        if(!verifytoken){
            return res.json(false)
        }
        const user=User.findById(verifytoken.id)
        if(!user){
            return res.json(false)
        }
        res.json(true)

    }catch(err){
        res.status(500).json({msg: err.message})
    }
}

//delete user
exports.destroy=async(req, res)=>{
    try{
        const deleteUser=await User.findByIdAndDelete(req.user)
        res.json(deleteUser)
    }catch(error){
        res.status(500).json({msg:error.message})
    }
}

//file upload
//storage for file
const storage=multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads')
    },
    filename:function(req, file, cb){
        cb(null, new Date().toISOString()+file.originalname)
    }
})

//file filter
const fileFilter=(req, file, cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

exports.upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
})