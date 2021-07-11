const router=require('express').Router()
const PostController=require('../controllers/PostController')
const Auth=require('../middlewares/auth')
//get all posts
router.get('/posts', Auth, PostController.posts)

//create new post
router.post('/create-post', Auth, PostController.create)

//delete post
router.delete('/delete/:id', Auth, PostController.delpost)


//export module
module.exports=router