import express from 'express';
import passport from 'passport';
import handlebars from "express-handlebars";
import expressSession from 'express-session';
import router from './routers/index.router.js';
import MongoStore from 'connect-mongo';
import {init} from './db/mongoose.js'
import {initPassport} from './config/passport.config.js';
import __dirname from "./utils.js";
import config from './config/config.js';
import { addLogger } from './utils/logger.js';
//db init
await init();
const app = express(); 
app.engine('handlebars',handlebars.engine({
    layoutsDir: __dirname+"/views/layouts",
    defaultLayout:'main'
}));
app.set('view engine','handlebars');
app.set('views',__dirname+'/views');

app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

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

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/',router);

const server = app.listen(config.port || 8080, ()=>{
    console.log("Listening on http://localhost:" + config.port || 8080);
})
server.on("error",error=>console.log(error));