document.getElementById('registerForm').addEventListener('submit', function(event){
    event.preventDefault();
    fetch('http://localhost:8080/register', {
        method: "POST",
        body: JSON.stringify({
            email: event.target.userEmail.value,
            password: event.target.userPassword.value,
        }),
        headers: {
            "Content-type": "application/json",
        }
    })
    .then(()=>{
        alert('Success');
        window.location = "http://localhost:8080/login";
    }).catch(err=>{
        alert(err);
    });
});