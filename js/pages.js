// Tomo el panel del usuario
const seccionUsuario = document.getElementById("seccionUsuario")

if (sessionStorage["logueado"]) {
	let { nombre } = JSON.parse(sessionStorage.getItem("Usuario")); // Desestructuro lo que tengo en el session para quedarme solo con el nombre
	// Si está logueado (hay algo en el session) tiene que mostrar el nombre y logout
	seccionUsuario.innerHTML = `
								<li class="nav-item my-auto"><b>Hola, ${nombre}</b></li>
								<li class="nav-item"><a class="nav-link active" aria-current="page" href="./reserva.html">Reservar</a></li>
								<li class="nav-item"><a class="nav-link active" aria-current="page" href="#" id="btnSalir">Salir</a></li>
								`
} else {
	// Si no está logueado mostrar opciones registrar y login
	seccionUsuario.innerHTML = `
								<li class="nav-item"><a class="nav-link active" aria-current="page" href="./login.html">Iniciar sesion</a></li>
								<li class="nav-item"><a class="nav-link active" aria-current="page" href="./register.html">Registrarme</a></li>
								`
}

// Borro el usuario almacenado en session Storage
function logout() {
	sessionStorage.clear();
	window.location.href = window.location.href;
}

const btnSalir = document.getElementById("btnSalir");

// Operador ternario
btnSalir && btnSalir.addEventListener("click", () =>{
	logout();
})