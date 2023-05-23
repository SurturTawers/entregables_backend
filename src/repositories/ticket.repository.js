import TicketDTO from "../dto/ticket.js";

export default class Ticket{
    constructor(dao){
        this.dao = dao;
    }

    create(purchaseInfo){
        const ticketDTO = new TicketDTO(purchaseInfo);
        return this.dao.create(ticketDTO);
    }
}