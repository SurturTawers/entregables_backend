import { userRepository } from "../repositories/index.js";

export default class UsersServices{
    static create(user){
        return userRepository.create(user);
    }

    static get(email){
        return userRepository.get(email);
    }
}