const auth=async (req,res,next)=>{

    if(!req.session.email){
        console.log(req.session.isLoggedIn)
        return res.redirect('/')
    }
    console.log(req.session.email)
    next()

}

module.exports=auth