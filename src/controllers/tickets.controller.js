import {isValidMongoId} from "../utils.js";
import TicketsServices from "../services/tickets.services.js";

class TicketsController{
    static async getTickets(req,res,next){
        const {email} = req.user;
        try{
            const tickets = await TicketsServices.getTickets(email);
            if(tickets.length>0){
                const resTickets = []
                tickets.forEach((ticket)=>{
                    resTickets.push({
                        id: ticket._id,
                        total: ticket.total
                    })
                })
                res.locals.data = {tickets: resTickets};
            }else{
                res.locals.data = {message: "No ha realizado compras"};
            }
            return next();
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }

    static async getTicketById(req,res,next){
        const {params:{tid}} = req;
        const {isValid, error, message} = isValidMongoId(tid);
        if (error || !isValid) {
            res.status(400).json({
                error: 'Invalid MongoId',
                message: message
            });
        }

        try {
            const ticket = await TicketsServices.getById(tid);
            if(ticket){
                res.locals.data = {ticket: ticket};
            }else{
                res.locals.data = {message: "Ticket no encontrado"};
            }
            next();
        } catch (error) {
            //console.log(error.message);
            res.status(400).json({
                error: `DB error: ${error.name} - Code: ${error.code}`,
                message: error.message
            });
        }
    }
}

export default TicketsController;