class ProductManager{
    constructor(){
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock){
        //Validar
        if(title.length===0) return "Title vacio";
        if(description.length===0) return "Description vacia";
        if(isNaN(price)) return "Price no es un numero";
        if(thumbnail.length===0) return "Ruta thumbnail vacia";
        if(code.length===0) return "Codigo vacio";
        if(isNaN(stock)) return "Stock no es un número";
        //si todo esta correcto
        //verifica si ya existe el código y crea el nuevo id
        let newId;
        if(this.products.length!==0){
            if(this.products.find((product) => product.code === code)) return "Producto ya existente";
            newId = this.products[this.products.length-1].id + 1;
        }else{
            newId = 1;
        }
        //si no existe el codigo ingresa el elemento
        this.products.push({
            id: newId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        });
        console.log("Producto insertado Correctamente");
    }
    getProducts(){
        return this.products;
    }

    getProductById(Id){
        let product = this.products.find((product)=> product.id === Id);
        if(product){
            return product;
        }else{
            console.error("Not found");
        }
    }
}


let pm = new ProductManager();
console.log(pm.getProducts());
console.log(pm.addProduct("producto prueba", "Este es un producto prueba",200,"Sin imagen", "abc123", 25));
console.log(pm.getProducts());
console.log(pm.addProduct("producto prueba", "Este es un producto prueba",200,"Sin imagen", "abc123", 25));
console.log(pm.getProductById(1));
console.log(pm.getProductById(2));



