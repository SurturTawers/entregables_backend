import ticketModel from '../models/ticket.js';

export default class Ticket{

    getTickets(email){
        return ticketModel.find({purchaser: email});
    }

    getById(tid, populate){
        if(populate) return ticketModel.findById(tid).populate(populate);
        return ticketModel.findById(tid);
    }

    create(info){
        return ticketModel.create(info);
    }
}