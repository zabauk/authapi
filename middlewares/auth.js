const jwt=require('jsonwebtoken')

const auth=(req, res, next)=>{
    try{
        const token=req.header('Authorization')
        if(!token){
            return res.status(401).json({msg: 'No authorization token'})
        }
        //verify token
        const verifytoken=jwt.verify(token, process.env.AUTH_SECRET_TOKEN)
        if(!verifytoken){
            return res.status(401).json({msg: 'Token verification failed'})
        }
        req.user=verifytoken.id
        next()
    }catch(error){
        res.status(500).json({msg: error.message})
    }
}

module.exports=auth