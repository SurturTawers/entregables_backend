import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.APP_PORT ,
    mongoUrl: process.env.MONGODB_URI,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_CLIENT_SECRET
}