import {ticketRepository} from '../repositories/index.js';

export default class TicketsServices{

    static getTickets(email){
        return ticketRepository.getTickets(email);
    }

    static getById(tid, populate){
        return ticketRepository.getById(tid,populate);
    }
}
