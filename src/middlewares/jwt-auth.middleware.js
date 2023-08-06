import {isValidJwtToken} from "../utils.js";
import passport from "passport";

const JWTAuthMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
        if (error) return next(error);
        if (!user) return res.status(401).json({succes: false, message: info.message ? info.message : info.toString()});
        req.user = user;
        next()
    })(req, res, next);
    /*
    const {headers} = req;
    const asd = req;
    console.log(asd);
    if(await isValidJwtToken(headers.authorization) /*|| await isValidJwtToken(res.options.access_token)) return next();
    res.status(401).json({success:false, message: "No autorizado"});
    /**/
}

export default JWTAuthMiddleware;