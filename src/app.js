import express from 'express';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import config from './config/config.js';
import router from './routers/index.router.js';
import passport from 'passport';
import {initPassport} from './config/passport.config.js';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import {init} from './db/mongoose.js'
import { addLogger } from './utils/logger.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

// SWAGGER OPTIONS
const swaggerOptions = {
    definition: {
        openapi:'3.0.1',
        info: {
            title: 'SurturTawers E-Commerce API',
            description: 'Proyecto final del curso de programación backend en Coderhouse'
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJsDoc(swaggerOptions);

// DB INIT
await init();

const app = express();

// HANDLEBARS INIT
app.engine('handlebars',handlebars.engine({
    layoutsDir: __dirname+"/views/layouts",
    defaultLayout:'main'
}));
app.set('view engine','handlebars');
app.set('views',__dirname+'/views');

// MIDDLEWARES
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());

// EXPRESS SESSIONS WITH MONGO
app.use(expressSession({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl:90,
    }),
    secret: config.sessionSecret,
    resave: true, //mantiene activa la sesion
    saveUninitialized: true //permite guardar aunque no se haya guardado info de sesion
}));

// PASSPORT INIT
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// ROUTERS INIT
app.use('/',router);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));

// SERVER INIT
const server = app.listen(config.port || 8080, ()=>{
    console.log("Listening on http://localhost:" + config.port || 8080);
})
server.on("error",error=>console.log(error));