document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('http://localhost:8080/api/login', {
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
            window.location = "http://localhost:8080/home";
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
