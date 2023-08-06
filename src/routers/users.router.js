import {Router} from "express";
import passport from 'passport';
import AuthController from "../controllers/auth.controller.js";
import {jwtTokenGenerator} from "../utils.js";

const usersRouter = Router();

usersRouter.post('/register', passport.authenticate('register', {failureRedirect: '/register', failureMessage:true}), (req, res) => {
    res.render('home',{success:true, access_token: jwtTokenGenerator(req.user)});
});

usersRouter.post('/login', passport.authenticate('login', {failureRedirect: '/login', failureMessage:true}), (req, res) => {
    //req.session.user = req.user;
    //res.redirect('/home');
    res.render('home',{success:true, access_token: jwtTokenGenerator(req.user)});
})

usersRouter.get('/github/login', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    //req.session.user = req.user;
    //res.redirect('/home');
    res.render('home',{success:true, access_token: jwtTokenGenerator(req.user)});
});

usersRouter.post('/logout', AuthController.logout);

export default usersRouter;