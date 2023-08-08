function logout() {
    fetch('https://entregablesbackend-production.up.railway.app/api/logout', {
        method: "POST",
    }).then((res) => {
        window.location = 'https://entregablesbackend-production.up.railway.app/login';
    }).catch(err => {
        alert(err);
    });
}
