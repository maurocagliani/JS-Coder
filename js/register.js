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
const API_USERS = 'https://647be977c0bae2880ad04cf4.mockapi.io/users';

fetch(API_USERS)
    .then(response => response.json())
    .then( datos => {
        usuarios = datos;
    });

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
        // Si no coinciden figura error con Toastify
        Toastify({
            text: "Las contraseñas no coinciden.",
            duration: 2000,
            backgroundColor: 'red',
            position: 'center'
        }).showToast();
    } else {
        // Si las contraseñas coinciden almaceno el usuario y borro los datos del formulario
        delete nuevoUsuario.contrasenia2; // Borro la contraseña 2 para no almacenar 2 veces el mismo dato.
        usuarios.push(nuevoUsuario);
        fetch(API_USERS, {
            method: 'POST',
            headers: {'content-type':'application/json'},
            body: JSON.stringify({
                "nombre":nuevoUsuario.nombre, 
                "usuario":nuevoUsuario.usuario,
                "contrasenia":nuevoUsuario.contrasenia,
                "tipo": nuevoUsuario.tipo,
                "reservas": nuevoUsuario.reservas,
                "id": Number(usuarios[usuarios.length-1].id)+1
            })
        }).then(res => res.json()).then(user => console.log(user))
        .catch(err => console.log(err))
        localStorage.setItem("Usuario", JSON.stringify(usuarios));
        formulario.reset();

        // "Inicio sesión"
        setTimeout(() => {
            sessionStorage.setItem("Usuario", JSON.stringify(nuevoUsuario));
            sessionStorage["logueado"] = true;
            window.location = "../index.html"
        }, 1000);
    }
})