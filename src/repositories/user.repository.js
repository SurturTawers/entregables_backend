import UserDTO from '../dto/user.js';

export default class User{
    constructor(dao){
        this.dao = dao;
    }

    create(user){
        const userDTO = new UserDTO(user);
        return this.dao.create(userDTO);
    }

    get(email){
        return this.dao.get(email);
    }
}