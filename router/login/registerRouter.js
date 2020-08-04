const {check,body} = require("express-validator");
const express = require('express');

const router= express.Router();

const registerController = require('../../controllers/login/registerController');


router.get('/register',registerController.getRegister);
router.get('/',registerController.getIndex);
router.get('/reset-password',registerController.resetPassword);
router.get('/reset-password/:token',registerController.getNewPassword);
router.post('/login',registerController.postLogin);
router.post('/register',
            check("email").isEmail().withMessage("must contain email"),
            check("name").isLength({min:5}).withMessage("name of at leats 5 characters"),
            body("password").isLength({min:8}).withMessage("password of at leats 8 characters"),
            body("confirmPassword").custom((value,{req})=>{
                if(value !== req.body.password){
                    throw new Error("password have to match");
                }
                return true;
            }),
            registerController.postRegister);
router.post("/logout",registerController.logOut);
router.post("/reset-password",registerController.postResetPassword);
router.post("/new-password",registerController.postNewPassword);


module.exports=router;