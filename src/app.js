import express from 'express';
import routerProductos from './routes/products.router.js';
import routerCarrito from './routes/carts.router.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/products',routerProductos);
app.use('/api/carts',routerCarrito);

app.get('/',(req,res)=>{
    res.send(`<h1 style="text-align:center;">Bienvenido</h1>`);
});

const server = app.listen(8080, ()=>{
    console.log("Listening on 8080");
})
server.on("error",error=>console.log(error));