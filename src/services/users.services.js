import UserModel from '../db/models/users.js';

export default class UsersServices{
    static get(query){
        return UserModel.findOne(query);
    }

    static create(user){
        return UserModel.create(user);
    }
}