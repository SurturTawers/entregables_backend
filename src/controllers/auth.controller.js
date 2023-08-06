import UsersServices from '../services/users.services.js';
import CustomError from '../utils/errors/CustomError.js';
import CustomErrorTypes from '../utils/errors/CustomErrorTypes.js';
import { createHash, validatePassword } from '../utils/passwordEncrypt.js';

class AuthController {
    static async register(req, email, password, done) {
        if(!email || !password) return done(null,false, {message: 'Faltan campos'});
        try {
            let user = await UsersServices.get(email);
            if (user) return done(null,false,{message: 'Usuario ya existe'});
            user = UsersServices.create({
                email,
                password: createHash(password),
            });
            return done(null,user);
        } catch (error) {
            return done(new Error({
                error: CustomError.createError({
                    name: "DB Error",
                    cause: "Connection error",
                    message: error.message,
                    code: CustomErrorTypes.DATABASE_ERR
                })
            }));
        }
    }

    static async login(req, email, password, done) {
        //req.logger.info({email: email, pass: password});
        if (!email || !password) {
            return done(null, false, {message: 'Faltan campos'});
        }
        try {
            const user = await UsersServices.get(email);
            console.log(user);
            if (!user || !validatePassword(password, user)) return done(null, false, {message: 'User doesn\'t exist'});
            return done(null, user);
        } catch (error) {
            return done(new Error({
                error: CustomError.createError({
                    name: "DB Error",
                    cause: "Connection error",
                    message: error.message,
                    code: CustomErrorTypes.DATABASE_ERR
                })
            }));
        }
    }

    static async githubLogin(access_token, refreshToken, profile, done) {
        try {
            let user = await UsersServices.get(profile._json.email);
            //console.log(user);
            if (!user) {
                user = await UsersServices.create({
                    email: profile._json.email,
                    password: ''
                });
            }
            return done(null,user);
        } catch (error) {
            return done(new Error({
                error: CustomError.createError({
                    name: "DB Error",
                    cause: "Connection error",
                    message: error.message,
                    code: CustomErrorTypes.DATABASE_ERR
                })
            }));
        }
    }

    static async logout(req, res) {
        res.clearCookie('token').status(200).json({success:true});
        /*
        req.session.destroy((error) => {
            if (!error) {
                res.redirect('/login');
            } else {
                res.send({status: 'Logout error', body: error});
            }
        });
        /**/
    }
}

export default AuthController;