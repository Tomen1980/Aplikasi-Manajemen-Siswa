module.exports = (req,res,next)=>{
    const Auth =  req.session.isLogedIn
    if(Auth){
        return next()
    }
    return res.redirect("/")
}