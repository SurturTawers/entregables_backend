import {Router} from "express";
import passport from 'passport';
import AuthController from "../controllers/auth.controller.js";

const usersRouter = Router();

usersRouter.post('/register', passport.authenticate('register', {failureRedirect: '/register'}), (req, res) => {
    res.redirect('/login');
});

usersRouter.post('/login', passport.authenticate('login', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/home');
});

usersRouter.get('/github/login', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/home');
});

usersRouter.post('/logout', AuthController.logout);
/*
(req, res) => {
    const {error, message} = AuthController.logout(req);
    if (!error) {
        res.redirect('/login');
    } else {
        res.send({status: message, body: error});
    }
});
*/
export default usersRouter;