function logout() {
    fetch('http://localhost:8080/api/logout', {
        method: "POST",
    }).then((res) => {
        window.location = 'http://localhost:8080/login';
    }).catch(err => {
        alert(err);
    });
}
