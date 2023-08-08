document.getElementById('newProductForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('https://entregablesbackend-production.up.railway.app/api/products', {
        method: "POST",
        body: JSON.stringify({
            title: event.target.title.value,
            description: event.target.description.value,
            code: event.target.code.value,
            price: event.target.price.value,
            stock: event.target.stock.value,
            category: event.target.category.value,
            thumbnails: []
        }),
        headers: {
            "Content-type": "application/json",
        }
    }).then((res) => {
        if(res.ok){
            document.getElementById('newProductMessage').innerHTML = 'Producto creado correctamente';
            document.getElementById('newProductMessage').style = 'color:green';
            alert('Producto creado correctamente');
        }else{
            return res.json();
        }
    }).then((data)=>{
        const errorMsg = document.getElementById('newProductMessage');
        switch(data.errorCode){
            case 11000:
                errorMsg.innerHTML = 'Ya existe un producto con el código ingresado';
                errorMsg.style = 'color: red';
                break;
        }
        alert('Error, intentelo nuevamente');
    }).catch(err => {
        console.log(err);
    });
});