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
        window.location = 'http://localhost:8080/home';
    }).catch(err => {
        alert(err);
    });
});
