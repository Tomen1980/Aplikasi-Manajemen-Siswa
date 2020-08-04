exports.getIndex=(req,res,next)=>{
    console.log(req.session.user)
    res.render("home/homeIndex.ejs",{
        pageTitle : "home",
        path : "/"
    })
}