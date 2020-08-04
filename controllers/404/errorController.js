exports.errorController=(req,res,next)=>{
    res.status(404).render("404/404.ejs",{
        pageTitle : "Page Not Found",
        path : "/404"
    })
}
exports.errorController500=(req,res,next)=>{
        res.status(500).render("404/500.ejs",{
            pageTitle : "An Error Has Occurred",
                 path : "/500"
        })
    }