class Usuario {
    constructor(nombre, usuario, contrasenia, tipo = "Alumno") {
        this.nombre = nombre; 
        this.usuario = usuario;
        this.contrasenia = contrasenia;
        this.tipo = tipo;
        this.reservas = [];
    }
}

// Si estoy logueado lo mando al index
if (sessionStorage["Usuario"]) {
    window.location = "../index.html";
}

// Array con todos los usuarios registrados
let usuarios = [];

// Traigo del HTML el elemento con ID  "register"
const formulario = document.getElementById("register");

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    // Tomo los valores del formulario
    const inputs = [...formulario.getElementsByTagName("input")]; // utilizo el spread para almacenarlo como array
    const nuevoUsuario = new Usuario (); // creo nuevo usuario

    // recorro el array y almaceno la información en el objeto
    for (let i = 0; i < inputs.length; i++) {  
        nuevoUsuario[inputs[i].id] = inputs[i].value
    }
    const {contrasenia, contrasenia2} = nuevoUsuario; // Desestructuro los datos que voy a necesitar para la consulta

    // Controlo que las contraseñas coincidan
    if (contrasenia != contrasenia2) {
        // Si no coinciden figura error
        alert("Las contraseñas no coinciden")
    } else {
        // Si las contraseñas coinciden almaceno el usuario y borro los datos del formulario
        delete nuevoUsuario.contrasenia2; // Borro la contraseña 2 para no almacenar 2 veces el mismo dato.
        usuarios.push(nuevoUsuario);
        localStorage.setItem("Usuario", JSON.stringify(usuarios));
        formulario.reset();

        // "Inicio sesión"
        sessionStorage.setItem("Usuario", JSON.stringify(nuevoUsuario));
        sessionStorage["logueado"] = true;
        window.location = "../index.html"
    }
})