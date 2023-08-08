import TicketDTO from "../dto/ticket.js";

export default class Ticket{
    constructor(dao){
        this.dao = dao;
    }

    getTickets(email){
        return this.dao.getTickets(email);
    }

    getById(tid,populate){
        return this.dao.getById(tid,populate);
    }

    create(purchaseInfo){
        const ticketDTO = new TicketDTO(purchaseInfo);
        return this.dao.create(ticketDTO);
    }
}