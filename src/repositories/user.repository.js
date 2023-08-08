import UserDTO from '../dto/user.js';

export default class User {
    constructor(dao) {
        this.dao = dao;
    }

    create(user) {
        const userDTO = new UserDTO(user);
        return this.dao.create(userDTO);
    }

    find(query){
        return this.dao.find(query);
    }

    get(email) {
        return this.dao.get(email);
    }

    getAll() {
        return this.dao.getAll();
    }

    update(uid, query) {
        return this.dao.update(uid, query);
    }

    delete(uid) {
        return this.dao.delete(uid);
    }

    deleteExpired(query) {
        return this.dao.deleteExpired(query);
    }

}