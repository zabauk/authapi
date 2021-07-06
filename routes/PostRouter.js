const router=require('express').Router()
const PostController=require('../controllers/PostController')
const Auth=require('../middlewares/auth')
//get all posts
router.get('/posts', PostController.posts)

//create new post
router.post('/create-post', Auth, PostController.create)


//export module
module.exports=router