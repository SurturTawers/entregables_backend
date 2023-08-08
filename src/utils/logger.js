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
    options.levels = customLogger.levels;
    options.transports = [
        //new winston.transports.Console({level:'http'}),
        //new winston.transports.File({filename: './errors.log', level:'warn'}),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLogger.colors}),
                winston.format.simple(),
            ),
        }),
        new winston.transports.File({
            level: 'warning',
            filename: './src/utils/logs/error.log',
            format: winston.format.simple(),
        }),
    ];
}else{
    options.transports = [
        new winston.transports.Console({level:'debug'}),
    ];
}

export const logger =  winston.createLogger(options);

logger.info(`NODE_ENV=${env}`);

export const addLogger = (req,res,next)=>{
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    //req.logger.error(`${req.method} en ${req.url} - un error lmao`);
    //req.logger.info(`${req.method} en ${req.url} - un info lmao`);
    //req.logger.debug(`${req.method} en ${req.url} - un debug lmao`);
    next();
}