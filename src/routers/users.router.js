import {Router} from "express";
import passport from 'passport';
import AuthController from "../controllers/auth.controller.js";
import {jwtTokenGenerator} from "../utils.js";

const usersRouter = Router();

usersRouter.post('/register', function (req, res, next) {
    passport.authenticate('register', function (error, user, info) {
        if (user) {
            req.user = user;
            return next();
        }
        if (error) return next(error);
        const {message, missingFields, userExists} = info;
        if (missingFields || userExists) {
            return res.status(400).json({
                success: false,
                missingFields: missingFields,
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

usersRouter.post('/login', function (req, res, next) {
    passport.authenticate('login', function (error, user, info) {
        if (user) {
            req.user = user;
            return next();
        }
        if (error) return next(error);
        const {message, missingFields, userNotFound} = info;
        if (missingFields || userNotFound) {
            return res.status(400).json({
                success: false,
                missingFields: missingFields,
                userNotFound: userNotFound,
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

usersRouter.get('/github/login', passport.authenticate('github', {
    failureRedirect: '/login'
}), (req, res) => {
    const token = jwtTokenGenerator(req.user);
    res.cookie('token', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
    });
    res.render('home', {success: true});
});

usersRouter.post('/logout', AuthController.logout);

export default usersRouter;