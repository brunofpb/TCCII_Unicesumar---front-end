const adminButton = document.getElementById("adminButton");
const adminForm = document.getElementById("adminForm");
const adminLoginForm = document.getElementById("adminLoginForm");

adminButton.addEventListener("click", function () {
    adminForm.style.display = "block";
});

adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const adminEmail = document.querySelector(".adminEmail");
    const adminPassword = document.querySelector(".adminPassword");

    console.log(adminEmail.value);
    console.log(adminPassword.value);

    const adminData = {
        email: adminEmail.value,
        senha: adminPassword.value
    };

    fetch('http://localhost:8080/login?email=' + encodeURIComponent(adminEmail.value) + '&senha=' + encodeURIComponent(adminPassword.value), {
        method: 'POST',
        body: JSON.stringify(adminData)
    })
        .then(response => {
            if (response.status === 200) {
                alert("Login bem-sucedido!");
                window.location.href = "telaAdm.html";
            } else if (response.status === 401) {
                alert("Credenciais inválidas. Por favor, tente novamente.");
                adminEmail.value = "";
                adminPassword.value = "";
            } else {
                throw new Error("Ocorreu um erro ao fazer login. Por favor, tente novamente.");
            }
        })
        .catch(error => {
            console.log('Erro:', error);
            alert("Erro ao acessar o banco de dados, contate o Responsável pelo sistema.");
        });
});
