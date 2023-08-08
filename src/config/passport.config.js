import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as GithubStrategy} from 'passport-github2';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import UserModel from '../models/users.js';
import config from "./config.js";
import AuthController from "../controllers/auth.controller.js";

function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) token = req.cookies.token;
    return token;
}

export const initPassport = () => {
    const options = {
        usernameField: 'email',
        passReqToCallback: true,
    };

    const githubOptions = {
        clientID: config.githubClientID,
        clientSecret: config.githubSecret,
        callbackURL: "http://127.0.0.1:8080/api/github/login"
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtSecret
    }, (payload, done) => {
        return done(null, payload);
    }));

    passport.use('register', new LocalStrategy(options, AuthController.register));

    passport.use('login', new LocalStrategy(options, AuthController.login));

    passport.use('github', new GithubStrategy(githubOptions, AuthController.githubLogin));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id);
        done(null, user);
    });
}