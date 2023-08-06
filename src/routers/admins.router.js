import {Router} from "express";
import passport from 'passport';
import {jwtTokenGenerator} from "../utils.js";

const adminsRouter = Router();

adminsRouter.post('/register', function (req, res, next) {
    passport.authenticate('register', function (error, user, info) {
        if (user) {
            req.user = user;
            return next();
        }
        if (error) return next(error);
        const {message, missingFields, invalidSecretPass, userExists} = info;
        if (missingFields || invalidSecretPass || userExists) {
            return res.status(400).json({
                success: false,
                missingFields: missingFields,
                invalidSecretPass: invalidSecretPass,
                userExists: userExists,
                message: message
            });
        }
    })(req, res, next);
}, (req, res) => {
    const token = jwtTokenGenerator(req.user);
    res.cookie('token', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
    });
    res.render('home', {success: true});
});
export default adminsRouter;