import express from 'express';
import handlebars from "express-handlebars";
import {Server} from 'socket.io';
import * as fs from 'fs';
//import routerProductos from './routes/products.router.js';
//import routerCarrito from './routes/carts.router.js';
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
//Create the storage
const path = __dirname+'/public/storage';
if(!fs.existsSync(path)){
    fs.mkdirSync(path);
}
if(!fs.existsSync(path+'/productos.json')){
    fs.writeFileSync(path+'/productos.json', JSON.stringify([]));
}

const app = express();
app.engine('handlebars',handlebars.engine({
    layoutsDir: __dirname+"/views/layouts",
    defaultLayout:'main'
}));
app.set('view engine','handlebars');
app.set('views',__dirname+'/views');

app.use(express.static(__dirname+'/public'));
//app.use(express.json());
//app.use(express.urlencoded({extended:true}));
//app.use('/api/products',routerProductos);
//app.use('/api/carts',routerCarrito);
app.use('/',viewsRouter);

const server = app.listen(8080, ()=>{
    console.log("Listening on 8080");
})
server.on("error",error=>console.log(error));

const socketServer = new Server(server);
socketServer.on('connection',socket=>{
    console.log("Server: cliente conectado");
    //Send products to new socket
    socket.emit("sendRTProducts",JSON.parse(fs.readFileSync(path+'/productos.json')));
    //delete product by id, then send the id to all sockets and a success message to request socket
    socket.on("deleteProduct",(id)=>{
        const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
        let producto = products.find((prod) => prod.id == id);
        if(producto){
            let index = products.indexOf(producto);
            products.splice(index,1);
            fs.writeFileSync(path+'/productos.json',JSON.stringify(products));
            socketServer.emit("deletedProduct",producto.id);
            socket.emit("deleteSuccess","Producto eliminado correctamente");
        }else{
            socket.emit("deleteNotFoundError","Producto a eliminar no encontrado");
        }
    });
    //Store new Product, then send to all sockets and success message to request socket
    socket.on('storeProduct',(product)=>{
        const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
        let codeExists = products.find(prod => prod.code===product.code);
        if(codeExists) {
            socket.emit("newProdCodeError","El código ya existe");
        }else{
            let newId;
            if(products.length!==0){
                newId = products[products.length-1].id + 1;
            }else{
                newId = 1;
            }
            let newProduct = {
                id:newId, 
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: true,
                stock: product.stock,
                category: product.category,
            };
            products.push(newProduct);
            fs.writeFileSync(path+'/productos.json',JSON.stringify(products));
            socketServer.emit("addedProduct",newProduct);
            socket.emit("storeSuccess","Producto guardado correctamente");
        }
    });
});
