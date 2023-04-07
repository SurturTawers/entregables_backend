const socket=io();
//HANDLEBARS PRODUCTS TEMPLATE
const template = Handlebars.compile(`
    <div id="prod_{{id}}" style="background-color:lightblue; text-align:center; margin-bottom: 3px">
        <h2>{{title}}  {{id}}</h2>
        <p>Description: {{description}}</p>
        <p>Codigo: {{code}}</p>
        <p>Precio: {{price}}</p>
        <p>Status: {{status}}</p>
        <p>Stock: {{stock}}</p>
        <p>Category: {{category}}</p>
    </div>
`);
//new socket retrieve products
socket.on('sendRTProducts',(products)=>{
    document.getElementById('rt-products-container').innerHTML = ""; 
    let results = "";
    products.forEach(product => {
        results = results.concat(template({
            title: product.title,
            id: product.id,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
        }));
    });
    document.getElementById('rt-products-container').innerHTML = results;
});
// new product added on server so update list
socket.on('addedProduct',(newProduct)=>{
    let prods = document.getElementById('rt-products-container').innerHTML;
    prods = prods.concat(template({
        title: newProduct.title,
        id: newProduct.id,
        description: newProduct.description,
        code: newProduct.code,
        price: newProduct.price,
        status: newProduct.status,
        stock: newProduct.stock,
        category: newProduct.category,
    }));
    document.getElementById('rt-products-container').innerHTML = prods;
});
//receive the delete product id to remove ot from the DOM
socket.on("deletedProd",(id)=>{
    let product = document.getElementById(`prod_${id}`);
    document.getElementById('rt-products-container').removeChild(product);
});

//submit handler for storing product
document.getElementById('new-prod-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    socket.emit("storeProduct",{
        title: event.target.title.value,
        description: event.target.description.value,
        code: event.target.code.value,
        price: event.target.price.value,
        stock: event.target.stock.value,
        category: event.target.category.value,
    });
});
//submit handler for delete product
document.getElementById('delete-prod-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    socket.emit("deleteProduct",event.target.id_prod.value);
});

//In case of code error 
socket.on('newProdCodeError',(data)=>{
    alert(data);
});
//in case of not finding product to delete
socket.on("deleteNotFoundError",(data)=>{
    alert(data);
});
//when a product is stored succesfully by this socket
socket.on("storeSuccess",(data)=>{
    alert(data);
});
//when a product is deleted successfully by this socket
socket.on("deleteSuccess",(data)=>{
    alert(data);
});