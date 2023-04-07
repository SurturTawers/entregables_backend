import express from 'express';
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import mongoCartsRouter from './routes/dbCarts.router.js';
import mongoProductsRouter from './routes/dbProducts.router.js';
import __dirname from "./utils.js";
import {init} from './db/mongoose.js'
import MongoStore from 'connect-mongo';
import expressSession from 'express-session';
//db init
await init();
const app = express();

app.engine('handlebars',handlebars.engine({
    layoutsDir: __dirname+"/views/layouts",
    defaultLayout:'main'
}));
app.set('view engine','handlebars');
app.set('views',__dirname+'/views');

app.use(expressSession({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl:90,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true, //mantiene activa la sesion
    saveUninitialized: true //permite guardar aunque no se haya guardado info de sesion
}));

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',viewsRouter);
app.use('/api/products',mongoProductsRouter);
app.use('/api/carts',mongoCartsRouter);

const server = app.listen(process.env.APP_PORT || 8080, ()=>{
    console.log("Listening on http://localhost:"+process.env.APP_PORT || 8080);
})
server.on("error",error=>console.log(error));