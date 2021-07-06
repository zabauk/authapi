const Post=require('../models/Postmodel')

//get posts
exports.posts=async(req, res)=>{
    try{
        const posts=await Post.find()
        res.json(posts)
    }catch(error){
        res.status(500).json({msg: error.message})
    }
}

//create post
exports.create=async(req, res)=>{
    try{
        const {title, body}=req.body
        //check empty fill
        if(!title || !body){
            return res.status(400).json({msg: 'Fill empty fields'})
        }

        //post model
        const newPost=new Post({
            title:title,
            body:body
        })

        const savedPost=await newPost.save()
        //show saved post
        res.json(savedPost)

    }catch(err){
        res.json(err.message)
    }
}