import winston from "winston";

const env = process.env.NODE_ENV || 'development';
const options = {};

const customLogger = {
    levels: {
        fatal:0,
        error:1,
        warning:2,
        info:3,
        debug:4,
    },
    colors: {
        fatal:'red',
        error:'orange',
        warning:'yellow',
        info:'blue',
        debug:'white',
    },
}

if(env === 'production'){
    options.transports = [
        new winston.transports.Console({level:'http'}),
        new winston.transports.File({filename: './errors.log', level:'warn'}),
    ];
}else{
    options.transports = [
        new winston.transports.Console({level:'debug'}),
    ];
}

const logger =  winston.createLogger(options);

export const addLogger = (req,res,next)=>{
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLlocalteTimeString()}`);
    //req.logger.error(`${req.method} en ${req.url} - un error lmao`);
    //req.logger.info(`${req.method} en ${req.url} - un info lmao`);
    //req.logger.debug(`${req.method} en ${req.url} - un debug lmao`);
    next();
}