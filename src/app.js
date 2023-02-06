const express = require("express");
const pm = require("./productManager.js");

const app = express();
let prodMan = new pm("./products.json");

//ROUTES
app.get("/",(req,res)=>{
    res.send("<h1>Bienvenide</h1>");
});
app.get("/products", (req, res)=>{
    let limite = req.query.limit;
    let htmlElements = `<h1 style="text-align:center;">Productos</h1>`;
    prodMan.getProducts()
        .then(result=>{
            if(limite && limite < result.length){
                let maxProds = [];
                for(let i = 0; i<limite; i++){
                    maxProds.push(result[i]);
                }
                maxProds.map(producto => {
                    htmlElements = htmlElements.concat(`
                    <div style="background-color:lightblue; text-align:center">
                        <h2>${producto.title}  ${producto.id}</h1>
                        <p>Codigo: ${producto.code}</p>
                        <p>Precio: ${producto.price}</p>
                        <p>Stock: ${producto.stock}</p>
                    </div>
                    `);
                })
                res.send(htmlElements);
            }else{
                result.map(producto => {
                    htmlElements = htmlElements.concat(`
                    <div style="background-color:lightblue; text-align:center">
                        <h2>${producto.title}  ${producto.id}</h2>
                        <p>Codigo: ${producto.code}</p>
                        <p>Precio: ${producto.price}</p>
                        <p>Stock: ${producto.stock}</p>
                    </div>
                    `);
                })
                res.send(htmlElements);
            }
        })
        .catch(error=>{
            res.send(`
                <div style="background-color:lightblue; text-align:center">
                    <h1>${error}</h1>
                </div>
            `);
        });    
});

app.get("/products/:pid",(req, res)=>{
    prodMan.getProductById(parseInt(req.params.pid))
    .then(result=>{
        res.send(          
            `
            <div style="background-color:lightblue; text-align:center">
                <h1>${result.title} ${result.id}</h1>
                <p>Codigo: ${result.code}</p>
                <p>Precio: ${result.price}</p>
                <p>Stock: ${result.stock}</p>
            </div>
            `
        );
    })
    .catch(error=>{
        res.send(`
                <div style="background-color:lightblue; text-align:center">
                    <h1>${error}</h1>
                    <p>El producto solicitado no existe</p>
                </div>
        `);
    });
});

//CONFIG
const PORT = 8080;
const server= app.listen(PORT,() =>{
    console.log("Servidor en puerto: ", PORT);
});
server.on("error", error => console.log("Error en el servidor: ", error));
app.use(express.urlencoded({extended:true}));