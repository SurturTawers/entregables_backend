import UserModel from '../db/models/users.js';

export default class UsersServices{
    static async get(query){
        return await UserModel.findOne(query);
    }

    static async create(user){
        return await UserModel.create(user);
    }
}