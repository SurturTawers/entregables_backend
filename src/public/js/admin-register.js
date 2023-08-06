document.getElementById('adminRegisterForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('http://localhost:8080/api/admin/register', {
        method: "POST",
        body: JSON.stringify({
            email: event.target.adminEmail.value,
            password: event.target.adminPassword.value,
            secretPassword: event.target.secretPassword.value,
            role: 'admin'
        }),
        headers: {
            "Content-type": "application/json",
        }
    }).then((res) => {
        if (res.ok) {
            window.location = "http://localhost:8080/home";
        } else {
            return res.json();
        }
    }).then((data) => {
        const {message, missingFields, invalidSecretPass, userExists} = data;
        if (missingFields || invalidSecretPass || userExists) {
            document.getElementById('adminRegisterErrors').innerHTML = `<span style="color:red">${message}</span>`;
        }
    }).catch(err => {
        console.log(err);
    });
});