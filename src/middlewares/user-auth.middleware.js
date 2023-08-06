const authRoleMiddleware = (rol) => (req,res,next)=>{
    if(req.user.rol !== rol) return res.status(403).json({success:false, message: "Forbidden"});
    next();
    /*
    if(req.session.user){
        return next();
    }
    res.redirect('/login');
    /**/
}

export default authRoleMiddleware;