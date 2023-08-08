import nodemailer from 'nodemailer';
import config from '../config/config.js';

class MailingServices {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.userEmail,
                pass: config.userPass
            },
        });
    }

    sendEmail(mailTo, asunto) {
        this.transporter.sendMail({
            from: config.userEmail,
            to: mailTo,
            subject: asunto,
            html: '<h1>Saludos desde coder ecommerce</h1>',
            attachments: []
        });
    }
}

export default new MailingServices();
