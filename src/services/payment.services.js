import Stripe from 'stripe';
import config from "../config/config.js";

export default class PaymentServices{
    constructor(){
        this.stripe = new Stripe(config.stripeSecret);
    }

    createPaymentIntent = async (data)=>{
        const paymentIntent = await this.stripe.paymentIntents.create(data);
        return paymentIntent;
    }

    createSession = async (sessionData)=>{
        const session = await this.stripe.checkout.sessions.create(sessionData);
        return session;
    }

    createCustomer = async(userData) => {
        const stripeCustomer = await this.stripe.customers.create(userData);
        return stripeCustomer;
    }

    getCustomer = async(userEmail)=>{
        const stripeCustomer = await this.stripe.customers.list({email:userEmail});
        return stripeCustomer;
    }
}