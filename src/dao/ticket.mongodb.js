import ticketModel from '../models/ticket.js';

export default class Ticket{

    getTickets(email){
        return ticketModel.find({purchaser: email});
    }

    getById(tid){
        return ticketModel.findById(tid);
    }

    create(info){
        return ticketModel.create(info);
    }
}