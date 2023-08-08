const authRoleMiddleware = (rol) => (req, res, next) => {
    let unauthorized = false;
    switch (rol) {
        case 'admin':
            if (req.user.role !== 'admin') unauthorized = true;
            break;
        case 'premium':
            if (req.user.role !== 'admin' && req.user.role !== 'premium') unauthorized = true;
            break;
        case 'user':
            if (req.user.role !== 'admin' && req.user.role !== 'user') unauthorized = true;
            break;
    }
    if (unauthorized) return res.redirect('/unauthorized');
    next();
}

export default authRoleMiddleware;