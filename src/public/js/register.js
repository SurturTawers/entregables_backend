document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('https://entregablesbackend-production.up.railway.app/api/register', {
        method: "POST",
        body: JSON.stringify({
            email: event.target.userEmail.value,
            password: event.target.userPassword.value,
            role: 'user'
        }),
        headers: {
            "Content-type": "application/json",
        }
    }).then((res) => {
        if (res.ok) {
            window.location = "https://entregablesbackend-production.up.railway.app/home";
        } else {
            return res.json();
        }
    }).then((data) => {
        const {message, missingFields, userExists} = data;
        if (missingFields || userExists) {
            document.getElementById('registerErrors').innerHTML = `<span style="color:red">${message}</span>`;
        }
    }).catch(err => {
        console.log(err);
    });
});