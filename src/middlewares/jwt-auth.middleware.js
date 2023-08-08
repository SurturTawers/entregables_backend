import {isValidJwtToken} from "../utils.js";
import passport from "passport";

const JWTAuthMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
        if (error) return next(error);
        if (!user) return res.redirect('/login');
        req.user = user;
        next()
    })(req, res, next);
}

export default JWTAuthMiddleware;