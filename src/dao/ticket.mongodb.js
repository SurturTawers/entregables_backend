import ticketModel from '../models/ticket.js';

export default class Ticket{
    create(info){
        return ticketModel.create(info);
    }
}