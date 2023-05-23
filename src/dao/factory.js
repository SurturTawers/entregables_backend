import config from "../config/config.js";

export let UserDAO;
export let ProductDAO;
export let CartDAO;
export let TicketDAO;

switch (config.persistenceType) {
    case 'mongodb':
        UserDAO = (await import('./users.mongodb.js')).default;
        ProductDAO = (await import('./products.mongodb.js')).default;
        CartDAO = (await import('./carts.mongodb.js')).default;
        TicketDAO = (await import('./ticket.mongodb.js')).default;
        break;
    /*
    case 'file':
        UserDAO = (await import('./user.file.js')).default;
        ProductDAO = (await import('./product.file.js')).default;
        CartDAO = (await import('./cart.file.js')).default;
        break;
    */
    default:
        /*UserDAO = (await import('./user.memory.js')).default;
        ProductDAO = (await import('./product.memory.js')).default;
        CartDAO = (await import('./cart.memory.js')).default;
        */
        break;
}
