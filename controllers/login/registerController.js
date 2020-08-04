const crypto = require("crypto")
const {validationResult} = require("express-validator")
const mailer = require("nodemailer")
const bcrypt = require("bcryptjs")
const {Op} = require("sequelize")
const templateMail = require("../../utils/mail")
const userModel = require("../../models/user/userModel")

let transporter = mailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: 'User Gmail',
      pass: 'Sandi APlikasi Gmail'
    },
    tls: { rejectUnauthorized: false }
  }); 

exports.getRegister=(req,res,next)=>{
    res.render('login/register',{
        pageTitle: 'Register',
        path     : '/register',
        error    : ""
    })
}

exports.getIndex= async (req,res,next)=>{
    let message = await req.flash("error");
    if(message.length > 0){
        message = message[0]
    }else{
        message = null
    }
    // console.log(req.session)
    res.render('login/index',{
        pageTitle: 'Login',
        path     : '/login',
        error : message,
    })
}

exports.postLogin=(req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    userModel.findAll({
        where:{email:email},
        attributes:["id","name","email","password"]
    })
    .then((user)=>{
        if(user.length < 1 ){
            req.flash("error","The You Email Intered Inncorect!!")
            return res.redirect("/")
        }
        bcrypt.compare(password,user[0].password)
        .then(Match=>{
            if(Match){
                req.session.isLogedIn = true
                req.session.user = user
                return req.session.save((err)=>{
                    console.log(err)
                    res.redirect("/home")
                    return transporter.sendMail({
                        to: email, 
                        from: '',
                        subject: "SIGN IN",
                        html:`<p>SELAMAT ${email} TELAH BERHASIL LOGIN </p>`
                    })
                    .then((result)=>{
                        console.log(result)
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                })
            }
            req.flash("error","The You Password Intered Inncorect!!")
            return res.redirect("/")
        })
        
    })
    .catch((err)=>{
        console.log(err)
    })
}

exports.postRegister=(req,res,next)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const message = validationResult(req)
    if(!message.isEmpty()){
        return res.status(422)
        .render('login/register',{
            pageTitle: 'Register',
            path     : '/register',
            error : message.array()[0].msg
        })
    }
    userModel.findAll({
        where:{email:email},
        attributes:[
            "id","name","email","password"
        ]
    })
    .then((UserDoc)=>{
        if(UserDoc.length > 0){
            return res.redirect("/register")
        }
        bcrypt.hash(password,12)
        .then((hasPassword)=>{
            const user = userModel.create({
                name:name,
                email:email,
                password:hasPassword
            })
            return user
        })
        .then((user)=>{
            res.redirect("/home")
            return transporter.sendMail({
                to: email, 
                from: '',
                subject: "SIGN UP",
                html:templateMail.mail
            })
            .then((result)=>{
                console.log(result)
            })
            .catch((err)=>{
                console.log(err)
            })
        })
    })
    .catch((err)=>{
        console.log(err);
    })
}

exports.logOut=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect("/")
    })
}

exports.resetPassword=(req,res,next)=>{
    let message = req.flash("error")
    if(message.length>0){
        message = message[0]
    }else{
        message = null
    }
    res.render("login/new-password",{
        pageTitle:"New Password",
        path:"/reset-password",
        error:message
    })
}

exports.postResetPassword=(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
            return res.redirect('/reset-password')
        }
        const token = buffer.toString("hex")
        userModel.findOne({
            where:{
                email:req.body.email
            }
        })
        .then((user)=>{
            if(!user){
                req.flash("error","email not found")
                return res.redirect("/reset-password")
            }
            user.resetToken = token
            user.resetTokenExpiretion = new Date().getTime()
            return user.save()
        })
        .then((result)=>{
            res.redirect("/")
            transporter.sendMail({
                to: req.body.email, 
                from: 'agung_jumantoro_27rpl@student.smktelkom-mlg.sch.id',
                subject: "Reset Password",
                html:`
                    <p>Click this link <a href="http://localhost:3000/reset-password/${token}">Link</a>
                    to set new password </p>
                `
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    })
   
}

exports.getNewPassword=(req,res,next)=>{
        const token = req.params.token
        userModel.findOne({
            where:{
                [Op.and]:[
                    {resetToken : token},
                    {resetTokenExpiretion:{[Op.lt]: new Date()}}
                ]
            }
        })
        .then((user)=>{
        let message = req.flash("error")
            if(message.length>0){
                message = message[0]
            }else{
                message = null
            }
        res.render("login/reset-password",{
            pageTitle:"New Password",
            path:"/reset-password",
            error:message,
            userid : user.id,
            passwordToken : token
        })
    })
    .catch((err)=>{
        console.log(err)
    })
}

exports.postNewPassword=(req,res,next)=>{
    const newPassword = req.body.password
    const userId = req.body.userid
    const passwordToken = req.body.passwordToken
    let resetUser
    userModel.findOne({
        where:{
            [Op.and]:[
                {resetToken : passwordToken},
                {resetTokenExpiretion:{[Op.lt]:new Date()}},
                {id : userId}
            ]
        }
    })
    .then((user)=>{
        resetUser = user
        return bcrypt.hash(newPassword,12)
    })
    .then((hashPassword)=>{
        resetUser.password = hashPassword
        resetUser.resetToken = null
        resetUser.resetTokenExpiretion = null
        return resetUser.save()
    })
    .then((result)=>{
        res.redirect("/")
    })
    .catch((err)=>{
        console.log(err)
    })
}