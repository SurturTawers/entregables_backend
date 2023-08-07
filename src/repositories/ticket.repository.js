import TicketDTO from "../dto/ticket.js";

export default class Ticket{
    constructor(dao){
        this.dao = dao;
    }

    getTickets(email){
        return this.dao.getTickets(email);
    }

    getById(tid){
        return this.dao.getById(tid);
    }

    create(purchaseInfo){
        const ticketDTO = new TicketDTO(purchaseInfo);
        return this.dao.create(ticketDTO);
    }
}