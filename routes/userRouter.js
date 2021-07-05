const router=require('express').Router()
const Auth=require('../middlewares/auth')
const UserController=require('../controllers/UserController')

//register router
router.post('/register', UserController.upload.single('avatar'), UserController.register)

//login Router
router.post('/login', UserController.login)

//delete user account
router.delete('/delete', Auth, UserController.destroy)

//check user login 
router.post('/tokenIsValid', UserController.tokencheck)

//get users
router.get('/users', UserController.index)

module.exports=router
