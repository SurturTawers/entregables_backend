const authRoleMiddleware = (rol) => (req,res,next)=>{
    switch(rol){
        case 'admin':
            if(req.user.role !== 'admin'){
                return res.redirect('/unauthorized');
                //return res.status(403).json({success:false, message: "No autorizado"});
            }
            break;
        case 'user':
            if(req.user.role !== 'admin' && req.user.role !== 'user'){
                return res.redirect('/unauthorized');
                //return res.status(403).json({success:false, message: "No autorizado"});
            }
            break;
    }
    next();
}

export default authRoleMiddleware;