export default class UserDTO{
    constructor(user){
        this.email= user.email;
        this.password = user.password;
        this.role = user.role;
        this.carrito = user.carrito;
    }
}