const { Router}=require('express')
// importing controller
const authController=require('../controllers/authController')
const router=new Router();
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/verify',authController.verify_gett);
// router.post('/verify',authController.verify_gett);
module.exports=router;