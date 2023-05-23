import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {Strategy as GithubStrategy} from 'passport-github2';
import UserModel from '../models/users.js';
import config from "./config.js";
import AuthController from "../controllers/auth.controller.js";

export const initPassport = ()=>{
    const options= {
        usernameField: 'email',
        passReqToCallback: true,
    };

    const githubOptions = {
        clientID: config.githubClientID,
        clientSecret: config.githubSecret,
        callbackURL: "http://127.0.0.1:8080/github/login"
    }

    passport.use('register',new LocalStrategy(options,async(req,email,password,done)=>{
        //console.log(req);
        const {fieldError, userExists, user, error} = await AuthController.register(email,password);
        if(fieldError) return done(new Error(fieldError));
        if(error) return done(new Error(error));
        if(userExists) return done(new Error("Usuario ya existe"));
        if(user) return done(null,user);
    }));

    passport.use('login', new LocalStrategy(options, async (req,email,password,done)=>{
        const {fieldError, userExists, validatePswdError, user, error} = await AuthController.login(email,password);
        if(fieldError) return done(new Error(fieldError));
        if(error) return done(new Error(error));
        if(userExists===false|| validatePswdError) return done(null,false);
        if(user) return done(null,user);
    }));

    passport.use('github', new GithubStrategy(githubOptions,async (access_token, refreshToken,profile,done)=>{
        const {error,user} = await AuthController.githubLogin(profile);
        if(error) return done(new Error(error));
        if(user) return done(null,user);
    }));

    passport.serializeUser((user,done)=>{
        //console.log(user);
        done(null,user._id);
    });
    passport.deserializeUser(async (id,done)=>{
        const user = await UserModel.findById(id);
        done(null,user);
    });
}