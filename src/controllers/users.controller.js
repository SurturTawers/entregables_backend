import UsersServices from "../services/users.services.js";
import MailingServices from "../services/mailing.services.js";

class UsersController {
    static async getAllUsers(req, res) {
        try {
            const users = await UsersServices.getAll();
            const usersResponse = users.map((user)=>{
               return {
                   _id: user._id,
                   email: user.email,
                   role: user.role,
                   carrito:user.carrito,
                   loginDate: user.loginDate,
                   expireDate: user.expireDate
               };
            });
            //console.log(usersResponse);
            res.render('users', {
                users: usersResponse,
                layout: 'admin-main'
            });
        } catch (error) {
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async deleteExpiredUsers(req, res) {
        const timeLimit = Date.now();
        const query = {role:'user', expireDate: {$lt: timeLimit}};
        try {
            const usersToDelete = await UsersServices.find(query);
            const result = await UsersServices.deleteExpired(query);
            if(result){
                for(let user of usersToDelete){
                    const result = await MailingServices.sendEmail(user.email,"Su cuenta ha sido eliminado por inactividad");
                }
            }
            res.status(200).json({message: "Deleted expired users", result: result});
        } catch (error) {
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async deleteUserById(req, res) {
        const {params: {uid}} = req;
        try {
            const result = await UsersServices.delete(uid);
            res.status(200).json({message: "Deleted user", result: result});
        } catch (error) {
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async updateUserRole(req, res) {
        const {params: {uid}, body: {role}} = req;
        console.log(role);
        try {
            const result = await UsersServices.update(uid, {role: role});
            res.status(200).json({message: "Updated user role", result: result});
        } catch (error) {
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }

    }
}

export default UsersController;
