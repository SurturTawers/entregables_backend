import UsersServices from '../services/users.services.js';
import CustomError from '../utils/errors/CustomError.js';
import CustomErrorTypes from '../utils/errors/CustomErrorTypes.js';
import { createHash, validatePassword } from '../utils/passwordEncrypt.js';

class AuthController{
    static async register(email, password){
        if(!email || !password) {
            return {fieldError: CustomError.createError({
                name: "Field Error",
                cause: "Required field is null",
                message: "Falta campo email o password de user",
                code: CustomErrorTypes.NUM_ARGS_ERR
            })};
            //return {fieldError: "Faltan campos"};
        }
        try{
            let user = await UsersServices.get(email);
            if(user) return {userExists: true};
            user = UsersServices.create({
                email,
                password: createHash(password),
            });
            return {user: user};
        }catch(error){
            return {error: CustomError.createError({
                name: "DB Error",
                cause: "Connection error",
                message: error.message,
                code: CustomErrorTypes.DATABASE_ERR
            })};
            //return {error: 'Error al obtener usuario: ' + error.message};
        }
    }

    static async login(email,password){
        if(!email || !password) {
            return {fieldError: CustomError.createError({
                name: "Field Error",
                cause: "Required field is null",
                message: "Falta campo email o password de user",
                code: CustomErrorTypes.NUM_ARGS_ERR
            })};
            //return {fieldError: "Faltan campos"};
        }
        try{
            const user = await UsersServices.get(email);
            if(!user) return {userExists: false};
            if(!validatePassword(password,user)){
                return {validatePswdError: CustomError.createError({
                    name: "Password Validation Error",
                    cause: "Invalid Password",
                    message: "Contraseña ingresada es inválida",
                    code: CustomErrorTypes.VALIDATION_ERR
                })};
            }    
            return {user:user};
        }catch(error){
            return {error: CustomError.createError({
                name: "DB Error",
                cause: "Connection error",
                message: error.message,
                code: CustomErrorTypes.DATABASE_ERR
            })};
            //return {error: "Error al obtener user: " + error.message};
        }
    }

    static async githubLogin(profile){
        try{
            //console.log(profile);
            let user = await UsersServices.get({email: profile._json.email});
            if(!user){
                user = await UsersServices.create({
                    email: profile._json.email,
                    password: ''
                });
            }
            //console.log(user);
            return {user:user};
        }catch(error){
            return {error: CustomError.createError({
                name: "DB Error",
                cause: "Connection error",
                message: error.message,
                code: CustomErrorTypes.DATABASE_ERR
            })};
        }
    }
    
    static async logout(req){
        req.session.destroy((error) => {
            if (!error) {
              return {error: false};
            } else {
              return {error: true, message: "Logout Error: " + error};
            }
        });
    }
}

export default AuthController;