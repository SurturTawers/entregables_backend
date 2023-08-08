export default class TicketDTO{
    constructor(purchaseInfo){ 
        this.total = purchaseInfo.total;
        this.purchaser = purchaseInfo.purchaser;
        this.items = purchaseInfo.items;
    }
}