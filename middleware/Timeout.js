module.exports = (req,res,next)=>{
    const time = req.session.user
    if(time){
        setTimeout(()=>{
            req.session.destroy((user)=>{
                // console.log(err)
                console.log("Session Destroy")
            })
        },1000*60*60)
    }
    next()
}