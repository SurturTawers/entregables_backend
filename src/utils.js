import {fileURLToPath} from "url";
import { dirname } from "path";
import jsonwebtoken from 'jsonwebtoken';
import config from './config/config.js';

export const jwtTokenGenerator = (user)=>{
    const payload = {
        email: user.email,
        role: user.role,
        carrito: user.carrito
    }
    const token = jsonwebtoken.sign(payload, config.jwtSecret, {expiresIn: '24h'});
    return token;
}

export const isValidJwtToken = (token)=>{
    return new Promise((resolve)=>{
        jsonwebtoken.verify(token, config.jwtSecret, (error, payload)=>{
            if(error){
                return resolve(false);
            }
           return resolve(true);
        });
        return token;
    });
}

export const isValidMongoId = (id) =>{
    if(typeof id != "string"){
        return {
            isValid: false,
            error: true,
            message: `Invalid type: ${typeof id}. Must be string`
        };
    }
    if(id.match(/^[0-9a-fA-F]{24}$/)){
        return {
            isValid: true,
            error: false,
            message: `It's a valid mongoId`
        };
    }
    return {
        isValid: false,
        error: false,
        message: `It's not a valid mongoId`
    };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;