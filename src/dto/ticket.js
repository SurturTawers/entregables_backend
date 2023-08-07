export default class TicketDTO{
    constructor(purchaseInfo){ 
        this.amount = purchaseInfo.amount;
        this.purchaser = purchaseInfo.purchaser;
    }
}