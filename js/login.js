// Si está logueado lo redirecciono al index
if (sessionStorage["Usuario"]) {
    window.location = "../index.html"
};

const API_USERS = 'https://647be977c0bae2880ad04cf4.mockapi.io/users';

let listaUsuarios;
fetch(API_USERS)
    .then(response => response.json())
    .then( datos => {
        listaUsuarios = datos;
        localStorage.setItem("Usuario", JSON.stringify(listaUsuarios));
    });


// Busco en la página el tag con id "login"
const formulario = document.getElementById("login");

formulario.addEventListener("submit", (e) => {
    // Prevengo que se recargue la Pág
    e.preventDefault();

    // Tomo los valores del form 
    const usuario = document.getElementById("usuario").value;
    const contrasenia = document.getElementById("contrasenia").value;

    let usuarios = JSON.parse(localStorage.getItem("Usuario"));
    let encontrado = false;

    usuarios && usuarios.forEach(e => {
        if (e.usuario === usuario && e.contrasenia === contrasenia)  {
            const usuarioJSON = JSON.stringify(e);
            sessionStorage.setItem("Usuario", usuarioJSON);
            sessionStorage["logueado"] = true;
            encontrado = true;
            Toastify({
                text: 'Logueado correctamente',
                duration: 500,
                position: "center",
                backgroundColor: 'green'
            });
            window.location = "../index.html";
        }
    });

    // Si no lo encuentra muestra el mensaje con toastify de usuario o contraseña incorrecto
    !encontrado && Toastify({
        text: "El usuario o la contraseña ingresada es incorrecto.",
        position: "center",
        backgroundColor: 'red',
        duration: 1500
    }).showToast();
})

