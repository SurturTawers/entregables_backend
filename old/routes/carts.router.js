import {Router} from 'express';
import * as fs from 'fs';
const routerCarrito = Router();
const path = './public/storage';
if(!fs.existsSync(path)){
    fs.mkdirSync(path);
}
if(!fs.existsSync(path+'/carritos.json')){
    fs.writeFileSync(path+'/carritos.json', JSON.stringify([]));
}
routerCarrito.post('/',(req,res)=>{
    const carritos = JSON.parse(fs.readFileSync(path+'/carritos.json'));
    if(carritos.length!==0){
        carritos.push({
            id: carritos[carritos.length-1].id + 1,
            products: [],
        });
    }else{
        carritos.push({
            id: 1,
            products: [],
        });
    }
    fs.writeFileSync(path+'/carritos.json',JSON.stringify(carritos));
    res.status(200).send(`<h1 style="text-align:center;">Carrito creado satisfactoriamente</h1>`);
});

routerCarrito.get('/:cid',(req,res)=>{
    let {cid} = req.params;
    cid = Number(cid);
    const carritos = JSON.parse(fs.readFileSync(path+'/carritos.json'));
    let carrito = carritos.find(cart => cart.id === cid);
    if(carrito){
        let htmlElements = `<h1 style="text-align:center;">Carrito ${carrito.id}</h1>`;
        if(carrito.products.length!==0){
            htmlElements= htmlElements.concat(`<ul>`);
            carrito.products.forEach(product=>{
                htmlElements= htmlElements.concat(`
                    <li>Producto: ${product.id} ---- Cantidad: ${product.quantity}</li>
                `);
            });
            htmlElements= htmlElements.concat(`</ul>`);
        }else{
            htmlElements= htmlElements.concat(`<p>Vacio</p>`);
        }
        res.status(200).send(htmlElements);
    }else{
        res.status(400).send(`<h1 style="text-align:center;">Carrito solicitado no existe</h1>`);
    }

});

routerCarrito.post('/:cid/product/:pid',(req,res)=>{
    let {cid,pid} = req.params;
    cid = Number(cid);
    pid = Number(pid);
    const carritos = JSON.parse(fs.readFileSync(path+'/carritos.json'));
    let carrito = carritos.find(cart=>cart.id===cid);
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    let existsProd = products.find((prod) => prod.id == pid);
    if(carrito && existsProd){
        let producto = carrito.products.find(prod=>prod.id===pid);
        if(producto){
            producto.quantity += 1;
        }else{
            carrito.products.push({
                product: pid,
                quantity: 1
            });
        }
        fs.writeFileSync(path+'/carritos.json',JSON.stringify(carritos));
        res.status(200).send(`<h1 style="text-align:center;">Producto insertado correctamente en su carrito</h1>`);
    }else{
        if(!carrito){
            res.status(400).send(`<h1 style="text-align:center;">Carrito solicitado no existe</h1>`);
        }else{
            res.status(400).send(`<h1 style="text-align:center;">Producto a ingresar al carrito no existe</h1>`);
        }
    }
});

export default routerCarrito;