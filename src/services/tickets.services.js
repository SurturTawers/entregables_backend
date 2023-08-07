import {ticketRepository} from '../repositories/index.js';

export default class TicketsServices{

    static getTickets(email){
        return ticketRepository.getTickets(email);
    }

    static getById(tid){
        return ticketRepository.getById(tid);
    }
}
