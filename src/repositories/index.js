import {UserDAO, ProductDAO, CartDAO, TicketDAO} from '../dao/factory.js';
import UserRepository from './user.repository.js';
import ProductRepository from './product.repository.js';
import CartRepository from './cart.repository.js';
import TicketRepository from './ticket.repository.js';

export const userRepository = new UserRepository(new UserDAO());
export const productRepository = new ProductRepository(new ProductDAO());
export const cartRepository = new CartRepository(new CartDAO());
export const ticketRepository = new TicketRepository(new TicketDAO());