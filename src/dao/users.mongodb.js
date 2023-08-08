import UserModel from '../models/users.js';

export default class User {
    create(user){
        return UserModel.create(user);
    }

    find(query){
        return UserModel.find(query);
    }

    get(email){
        return UserModel.findOne({email:email});
    }

    getAll(){
        return UserModel.find({});
    }

    update(uid,query){
        return UserModel.findByIdAndUpdate(uid,query);
    }

    delete(uid){
        return UserModel.findByIdAndDelete(uid);
    }

    deleteExpired(query){
        return UserModel.deleteMany(query);
    }
}