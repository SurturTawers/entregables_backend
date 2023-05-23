export default class TicketDTO{
    constructor(purchaseInfo){ 
        this.code = purchaseInfo.code;
        this.amount = purchaseInfo.amount;
        this.purchaser = this.purchaseInfo.purchaser;
    }
}