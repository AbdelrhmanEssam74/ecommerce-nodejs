exports.authMiddleware=async(req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.status(401).send("Access denied")
    }
}

exports.checkAuthorize=async (req,res,next)=>{
    if(req.session.user && req.session.user.role=='admin'){
        next()
    }
    else{
        res.status(403).send('UnAuthorized')
    }
}

