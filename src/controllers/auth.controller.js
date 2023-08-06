import UsersServices from '../services/users.services.js';
import CustomError from '../utils/errors/CustomError.js';
import CustomErrorTypes from '../utils/errors/CustomErrorTypes.js';
import {createHash, validatePassword} from '../utils/passwordEncrypt.js';
import config from "../config/config.js";

class AuthController {
    static async register(req, email, password, done) {
        const {body: {secretPassword,role}} = req;
        if (!email || !password || (role === 'admin' && !secretPassword)) return done(null, false, {message: 'Faltan campos', missingFields:true});
        if(role === 'admin' && secretPassword !== config.adminSecret) return done(null, false, {message: 'Clave secreta inválida', invalidSecretPass: true});
        try {
            let user = await UsersServices.get(email);
            if (user) return done(null, false, {message: 'Usuario ya existe', userExists: true});
            user = await UsersServices.create({
                email,
                password: createHash(password),
                role: role
            });
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

    static async login(req, email, password, done) {
        //req.logger.info({email: email, pass: password});
        if (!email || !password) {
            return done(null, false, {message: 'Faltan campos', missingFields: true});
        }
        try {
            const user = await UsersServices.get(email);
            if (!user || !validatePassword(password, user)) return done(null, false, {message: 'User doesn\'t exist', userNotFound:true});
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
                    password: '',
                    role: 'user'
                });
            }
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

    static async logout(req, res) {
        res.clearCookie('token').status(200).json({success: true});
    }
}

export default AuthController;