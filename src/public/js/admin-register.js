
document.getElementById('adminRegisterForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch(`https://entregablesbackend-production.up.railway.app/api/admin/register`, {
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
            window.location = `https://entregablesbackend-production.up.railway.app/home`;
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