document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('https://entregablesbackend-production.up.railway.app/api/login', {
        method: "POST",
        body: JSON.stringify({
            email: event.target.email.value,
            password: event.target.password.value,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    }).then((res) => {
        if (res.ok) {
            window.location = "https://entregablesbackend-production.up.railway.app/home";
        } else {
            return res.json();
        }
    }).then((data) => {
        const {message, missingFields, userNotFound} = data;
        if (missingFields || userNotFound) {
            document.getElementById('loginErrors').innerHTML = `<span style="color:red">${message}</span>`;
        }
    }).catch(err => {
        console.log(err);
    });
});
