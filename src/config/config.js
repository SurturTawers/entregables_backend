import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.APP_PORT ,
    persistenceType: process.env.PERSISTENCE_TYPE || 'memory',
    mongoUrl: process.env.MONGODB_URI,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_CLIENT_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    adminSecret: process.env.ADMIN_SECRET
}