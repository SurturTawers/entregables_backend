import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {Strategy as GithubStrategy} from 'passport-github2';
import UserModel from '../db/models/users.js'
import { createHash, validatePassword } from "../utils/passwordEncrypt.js";

export const initPassport = ()=>{
    const options= {
        usernameField: 'email',
        passReqToCallback: true,
    };

    const githubOptions = {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/github/login"
    }

    passport.use('register',new LocalStrategy(options,async(req,email,password,done)=>{
        //console.log(req);
        if(!email || !password) return done (new Error('Faltan campos'));
        try{
            let user = await UserModel.findOne({email});
            if(user) return done(null,false);
            user = await UserModel.create({
                email,
                password: createHash(password),
            });
            done(null,user);
        }catch(error){
            return done(new Error('Error al obtener usuario: ' + error.message))
        }
    }));

    passport.use('login', new LocalStrategy(options, async (req,email,password,done)=>{
        try{
            const user = await UserModel.findOne({email});
            if(!user) {
                return done(null,false)
            }
            if(!validatePassword(password,user)) {
                return done(null,false)
            }
            console.log(user);
            done(null,user);
        }catch(error){
            return done(new Error("Error al obtener user: "+error.message));
        }
    }));

    passport.use('github', new GithubStrategy(githubOptions,async (access_token, refreshToken,profile,done)=>{
        try{
            console.log(profile);
            let user = await UserModel.findOne({email: profile._json.email});
            if(!user){
                user = await UserModel.create({
                    email: profile._json.email,
                    password: ''
                });
            }
            console.log(user);
            done(null,user);
        }catch(error){
            return done(new Error('Error al obtener usuario: '+ error.message));
        }
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