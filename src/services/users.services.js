import { userRepository } from "../repositories/index.js";

export default class UsersServices{
    static create(user){
        return userRepository.create(user);
    }

    static get(email){
        return userRepository.get(email);
    }

    static find(query){
        return userRepository.find(query);
    }

    static getAll(){
        return userRepository.getAll();
    }

    static update(uid,query){
        return userRepository.update(uid,query);
    }

    static delete(uid){
        return userRepository.delete(uid);
    }

    static deleteExpired(query){
        return userRepository.deleteExpired(query);
    }

}