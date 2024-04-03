const { Router}=require('express')
const {requireAuth}=require('../Middleware/authMiddleware')
// console.log(requireAuth);
// importing controller
const authController=require('../controllers/authController')
const router=new Router();
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.post('/idverify',authController.verify_id);
router.get('/logout',authController.logout_get);
 // router.get('/home',requireAuth,authController.verify_user);
//router.get('/chat',requireAuth,)
// router.get('/set-cookies',authController.cookies_set);
// router.get('/read-cookies',);
module.exports=router;