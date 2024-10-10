const express=require("express");
const { body }=require("express-validator");
const verifytoken=require("../middleware/isauth.js");
const mail=require("../middleware/mailer.js");
const {
  signUp,
  logIn,
  otpVerify,
  changePassword,
  forgotPassword,

}=require("../controller/authController.js");



const router=express.Router();

router.post('/signup',
[
   body('email','Please enter a valid mail')
   .normalizeEmail()
   .not()
    .isEmpty()

,
    body('password','Please enter valid password')
    .trim()
    .isLength({min:8}),

    body('name','Please enter valid name')
    .trim()
    .isLength({min:2})

],signUp,mail);

router.post('/login',
[
  body('email','Please enter a valid mail')
  .normalizeEmail()
  .not()
   .isEmpty()

,
   body('password','Please enter valid password')
   .trim()
  .not()
  .isEmpty()
],logIn);
  

  router.post('/forgotpassword',
  [
    body('email','Please enter a valid mail')
    .normalizeEmail()
    .not()
     .isEmpty()
  ],forgotPassword,mail);



  router.post('/otpverify',
  [


    body('otp','Please enter a valid otp')
    .not()
     .isEmpty()


  ],verifytoken,otpVerify);


  router.put('/resendotp',verifytoken,mail);


  router.put('/changepassword',
  [
    body('newpassword','Please enter a valid mail')
    .not()
     .isEmpty(),
  ],verifytoken,changePassword);

    

module.exports=router;

