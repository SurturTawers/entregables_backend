import {Router} from 'express';
import * as fs from 'fs';
const routerProductos = Router();
const path = './public/storage';
if(!fs.existsSync(path)){
    fs.mkdirSync(path);
}
if(!fs.existsSync(path+'/productos.json')){
    fs.writeFileSync(path+'/productos.json', JSON.stringify([]));
}

routerProductos.get('/',(req,res)=>{
    let {limit} = req.query;
    limit = Number(limit);
    let htmlElements = `<h1 style="text-align:center;">Productos</h1>`;
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    if(products.length!==0){
        if(limit){
            let iterador;
            limit<products.length ? iterador = limit : iterador = products.length;
            for(let i=0; i<iterador; ++i){
                htmlElements = htmlElements.concat(`
                    <div style="background-color:lightblue; text-align:center">
                        <h2>${products[i].title}  ${products[i].id}</h1>
                        <p>Description: ${products[i].description}</p>
                        <p>Codigo: ${products[i].code}</p>
                        <p>Precio: ${products[i].price}</p>
                        <p>Status: ${products[i].status}</p>
                        <p>Stock: ${products[i].stock}</p>
                        <p>Category: ${products[i].category}</p>
                    </div>
                `);
            }
        }else{
            products.forEach(producto=>{
                htmlElements = htmlElements.concat(`
                    <div style="background-color:lightblue; text-align:center">
                        <h2>${producto.title}  ${producto.id}</h1>
                        <p>Description: ${producto.description}</p>
                        <p>Codigo: ${producto.code}</p>
                        <p>Precio: ${producto.price}</p>
                        <p>Status: ${producto.status}</p>
                        <p>Stock: ${producto.stock}</p>
                        <p>Category: ${producto.category}</p>
                    </div>
                `);
            });
        }
        res.status(200).send(htmlElements);
    }else{
        res.status(200).send(`<h1 style="text-align:center;">No hay productos</h1>`);
    }
});

routerProductos.post('/',(req,res)=>{
    let requiredErrors = "";
    let error = false;
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    //Validaciones
    let {title,description,code,price,stock,category} = req.body;
    !title ? (requiredErrors+="Falta title\n" , error=true) : null; 
    !description ? (requiredErrors+="Falta description\n" , error=true) : null; 
    !code ? (requiredErrors+="Falta code\n" , error=true) : (products.length!==0 ? (products.find(prod => prod.code===code) ? (requiredErrors+= "Producto con este codigo ya existe", error=true):null):null);
    !price ? (requiredErrors+="Falta price\n" , error=true) : (isNaN(price) ? (requiredErrors+= "Price debe ser numero", error=true) :null); 
    !stock ? (requiredErrors+="Falta stock\n" , error=true) : (isNaN(stock) ? (requiredErrors+= "Stock debe ser numero", error=true) :null); 
    !category ? (requiredErrors+="Falta category\n" , error=true) : null; 
    //si hubo errores
    if(error){
        res.status(400).send(`Errores: \n${requiredErrors}`)
    }else{
        let newId;
        if(products.length!==0){
            newId = products[products.length-1].id + 1;
        }else{
            newId = 1;
        }
        products.push({
            id:newId, 
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category
            //thumbnails: 
        });
        fs.writeFileSync(path+'/productos.json',JSON.stringify(products));
        res.status(200).send(`<h1 style="text-align:center;">Producto insertado correctamente</h1>`);
    }
});

routerProductos.get('/:pid',(req,res)=>{
    let {pid} = req.params;
    pid = Number(pid);
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    let producto = products.find((prod)=> prod.id === pid);
        if(producto){
            res.status(200).send(`
            <h1>Producto ${producto.id}</h1>
            <div style="background-color:lightblue; text-align:center">
                <h2>${producto.title}</h2>
                <p>Description: ${producto.description}</p>
                <p>Codigo: ${producto.code}</p>
                <p>Precio: ${producto.price}</p>
                <p>Status: ${producto.status}</p>
                <p>Stock: ${producto.stock}</p>
                <p>Category: ${producto.category}</p>
            </div>
        `)
        }else{
            res.status(400).send(`<h1 style="text-align:center;">Producto solicitado no existe</h1>`);
        }
});

routerProductos.put('/:pid',(req,res)=>{
    let {pid} = req.params;
    pid = parseInt(pid);
    let {title,description,code,price,status,stock,category} = req.body;
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    if(!products.find((prod)=> prod.code === code)){
        let producto = products.find((prod)=> prod.id === pid);
        if(producto){
            title ? producto.title = title : null; 
            description ? producto.description = description : null;
            code ? producto.code = code : null;
            price ? producto.price = price : null;
            status ? producto.status = status : null;
            stock ? producto.stock = stock : null;
            category ? producto.category = category : null;
            fs.writeFileSync(path+'/productos.json',JSON.stringify(products));
            res.status(200).send(`<h1 style="text-align:center;">Producto actualizado correctamente</h1>`);
        }else{
            res.status(400).send(`<h1 style="text-align:center;">Producto a actualizar no existe</h1>`);
        }
    }else{
        res.status(400).send(`<h1 style="text-align:center;">Producto no se ha podido actualizar, su código ya existe</h1>`);
    }
    
});

routerProductos.delete('/:pid',(req,res)=>{
    let {pid} = req.params;
    pid = Number(pid);
    const products = JSON.parse(fs.readFileSync(path+'/productos.json'));
    let producto = products.find((prod) => prod.id == pid);
    console.log(producto);
    if(producto){
        let index = products.indexOf(producto);
        products.splice(index,1);
        fs.writeFileSync(path+'/productos.json',JSON.stringify(products));
        res.status(200).send(`<h1 style="text-align:center;">Eliminado Correctamente</h1>`);
    }else{
        res.status(400).send(`<h1 style="text-align:center;">Producto a eliminar no existe</h1>`);
    }
});

export default routerProductos;