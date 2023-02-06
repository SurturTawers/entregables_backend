const fs = require('fs');

class ProductManager{
    constructor(path){
        if(path.length!==0){
            this.path=path;
            if (!fs.existsSync(path)) fs.writeFileSync(path,JSON.stringify([]));
        }else{
            console.log("Path is null");
        }
    }
    updateProduct(Id, update){
        let products = JSON.parse(fs.readFileSync(this.path));
        let product = products.find((product)=> product.id === Id);
        if(product){
            product.title = update.title;
            product.description = update.description;
            product.price = update.price;
            product.thumbnail = update.thumbnail;
            product.code = update.code;
            product.stock = update.stock;
            fs.writeFileSync(this.path,JSON.stringify(products));
            return "Producto actualizado correctamente";
        }else{
            return "Not found";
        }
    }
    deleteProduct(Id){
        let products = JSON.parse(fs.readFileSync(this.path));
        let product = products.find((product)=> product.id === Id);
        if(product){
            let index = products.indexOf(product);
            products.splice(index,1);
            fs.writeFileSync(this.path,JSON.stringify(products));
            console.log("Eliminado correctamente");
        }else{
            console.log("Producto a eliminar no existe");
        }
    }
    addProduct(product){
        //Validar
        if(product.title.length===0) return "Title vacio";
        if(product.description.length===0) return "Description vacia";
        if(isNaN(product.price)) return "Price no es un numero";
        if(product.thumbnail.length===0) return "Ruta thumbnail vacia";
        if(product.code.length===0) return "Codigo vacio";
        if(isNaN(product.stock)) return "Stock no es un número";
        //si todo esta correcto
        //verifica si ya existe el código y crea el nuevo id
        let products = JSON.parse(fs.readFileSync(this.path));
        let newId;
        if(products.length!==0){
            if(products.find((prod) => prod.code === product.code)) return "Producto ya existente";
            newId = products[products.length-1].id + 1;
        }else{
            newId = 1;
        }
        //si no existe el codigo ingresa el elemento
        products.push({id: newId , ...product});
        fs.writeFileSync(this.path,JSON.stringify(products));
        console.log("Producto insertado Correctamente");
    }
    getProducts(){
        return new Promise((resolve, reject)=>{
            fs.readFile(this.path,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    getProductById(Id){
        return new Promise((resolve,reject)=>{
            fs.readFile(this.path, (err,data)=>{
                if(err){
                    reject(err);
                }else{
                    let products = JSON.parse(data);
                    let product = products.find((producto)=> producto.id === Id);
                    if(product){
                        resolve(product);
                    }else{
                        reject("Product not found");
                    }
                }
            });
        })
    }
}

module.exports = ProductManager;
const pm = new ProductManager("./products.json");
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc122",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc121",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc120",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc125",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc126",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc127",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc128",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc129",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc139",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc149",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc159",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc169",
    stock: 25
}));
console.log(pm.addProduct({
    title: "Producto de prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc179",
    stock: 25
}));