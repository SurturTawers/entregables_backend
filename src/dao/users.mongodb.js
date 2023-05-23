import UserModel from '../models/users.js';

export default class User {
    create(user){
        return UserModel.create(user);
    }

    get(email){
        return UserModel.findOne({email:email});
    }
}