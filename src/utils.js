import {fileURLToPath} from "url";
import { dirname } from "path";
import jsonwebtoken from 'jsonwebtoken';
import config from './config/config.js';

const tokenGenerator = (user)=>{
    const payload = {
        email: user.email,
        name: user.name
    }
    const token = jsonwebtoken.sign(payload, config.jwtSecret, {expiresIn: '24h'});
    return token;
}

export const isValidToken = (token)=>{
    jsonwebtoken.verify(token, config.jwtSecret, (err, credentials)=>{
        if(err){
            return resolve(false);
        }else{
            return resolve(true);
        }
    });
    return token;
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