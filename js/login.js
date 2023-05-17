// Si está logueado lo redirecciono al index
if (sessionStorage["Usuario"]) {
    window.location = "../index.html"
};

let listaUsuarios = [
    {
        nombre: "Pepe",
        usuario: "pepe@test.com",
        contrasenia: "123123",
        tipo: "Piloto",
        reservas: []
    }
]
localStorage.setItem("Usuario", JSON.stringify(listaUsuarios));

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
        console.log(e.usuario)
        console.log(e.contrasenia)
        if (e.usuario === usuario && e.contrasenia === contrasenia)  {
            const usuarioJSON = JSON.stringify(e);
            sessionStorage.setItem("Usuario", usuarioJSON);
            sessionStorage["logueado"] = true;
            encontrado = true;
            alert("Logueado")
            window.location = "../index.html";
        }
    });

    !encontrado && alert("El usuario o la contraseña ingresada es incorrecto.");
})

