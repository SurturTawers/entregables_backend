import UserModel from '../db/models/users.js';
import { createHash, validatePassword } from '../utils/passwordEncrypt.js';

class AuthController{
    static async register(email, password){
        if(!email || !password) return {fieldError: "Faltan campos"};
        try{
            let user = await UserModel.findOne({email});
            if(user) return {userExists: true};
            user = await UserModel.create({
                email,
                password: createHash(password),
            });
            return {user: user};
        }catch(error){
            return {error: 'Error al obtener usuario: ' + error.message};
        }
    }

    static async login(email,password){
        if(!email || !password) return {fieldError: "Faltan campos"};
        try{
            const user = await UserModel.findOne({email});
            if(!user) return {userExists: false};
            if(!validatePassword(password,user)) return {validatePswdError: true};
            //console.log(user);
            return {user:user};
        }catch(error){
            return {error: "Error al obtener user: " + error.message};
        }
    }

    static async githubLogin(profile){
        try{
            //console.log(profile);
            let user = await UserModel.findOne({email: profile._json.email});
            if(!user){
                user = await UserModel.create({
                    email: profile._json.email,
                    password: ''
                });
            }
            //console.log(user);
            return {user:user};
        }catch(error){
            return {error: 'Error al obtener usuario: ' + error.message};
        }
    }
    
    static logout(req){
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