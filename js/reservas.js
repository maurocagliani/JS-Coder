const API = 'https://647be977c0bae2880ad04cf4.mockapi.io/aviones';
const API_USERS = 'https://647be977c0bae2880ad04cf4.mockapi.io/users';

// Si NO estoy logueado lo mando al index
if (!sessionStorage["Usuario"]) {
    window.location = "../index.html";
}

// Precio del turno según el tipo de usuario
const
    PRECIO_ALUMNO = 70,
    PRECIO_PILOTO = 60;

// Declaración clase Avion
class Avion {
    constructor(id, marca, modelo, lunes, martes, miercoles, jueves, viernes) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.lunes = lunes;
        this.martes = martes;
        this.miercoles = miercoles;
        this.jueves = jueves;
        this.viernes = viernes;
    }
}

// Creación de los aviones disponibles
let avionesDisponibles = [];

fetch(API)
    .then(Response => Response.json())
    .then(datos => {
        for (let i = 0; i < datos.length; i++) {
            avionesDisponibles.push(new Avion(Number(datos[i].id), datos[i].marca, datos[i].modelo, datos[i].lunes, datos[i].martes, datos[i].miercoles, datos[i].jueves, datos[i].viernes));
        }

        // Busco las secciones que voy a modificar a medida que vayan seleccionando
        const seccionAvion = document.getElementById("seccionAvion");
        const seccionDias = document.getElementById("seccionDias");
        const seccionTurnos = document.getElementById("seccionTurnos");
        const seccionBoton = document.getElementById("seccionBoton");

        // Armo el Select con todos los aviones disponibles
        let selectAvion = "<select class='col-auto mt-3 form-select' id='avionElegido'>\n<option value='-1' disabled selected>Elegir avion</option>\n";
        avionesDisponibles.forEach(avion => {
            selectAvion += ` <option value="${avion.id}">${avion.marca} ${avion.modelo}</option>\n`
        })
        selectAvion += "</select>";

        // Agrego los aviones como opciones
        seccionAvion.innerHTML = selectAvion;

        // Tomo el select Avion del HTML para ver cuando cambia
        let avionElegido = document.getElementById("avionElegido");

        avionElegido.addEventListener("change", () => {
            // Desestructuro las propiedades del objeto. Me interesan los días en una única variable separada del resto de la información
            let { id, marca, modelo, ...dias } = avionesDisponibles[avionElegido.value-1]

            // Si cambio el avion tengo que resetear las opciones dado que pueden no ser las mismas para los distintos aviones
            seccionTurnos.innerHTML = "";
            seccionDias.innerHTML = "";
            seccionBoton.innerHTML = "";
            // Creo una opción por cada día
            let selectDia = "<select class='col-auto mt-3 form-select' id='diaElegido'>\n<option value='-1' disabled selected>Elegir día</option>\n";
            Object.entries(dias).map(dia => {
                // Para cada día me voy a fijar si tiene al menos 1 true para saber si el día va a estar habilitado o no
                let disabled = dia[1].filter(turno => turno != false).length ? "" : "disabled";
                selectDia += ` <option value="${dia[0]}" ${disabled}>${dia[0]}</option>\n`
            })
            selectDia += "</select>";

            // Pongo el select con las opciones dentro de la seccion dias
            seccionDias.innerHTML = selectDia;

            // Tomo el select con los días para ver cuando cambia
            let diaElegido = document.getElementById("diaElegido");

            diaElegido.addEventListener("change", () => {
                // Me quedo con los turnos del día elegido
                let turnos = dias[diaElegido.value];

                // Si cambio el día tengo que resetear las opciones dado que pueden no ser las mismas para los distintos aviones
                seccionTurnos.innerHTML = "";
                seccionBoton.innerHTML = "";
                // Creo un select por cada turno
                let selectTurnos = "<select class='col-auto mt-3 form-select' id='turnoElegido'>\n<option value='-1' disabled selected>Elegir turno</option>\n";
                let i = 0
                turnos.map(turno => {
                    selectTurnos += ` <option value="${i}" ${turno ? "" : "disabled"}>Turno ${++i}</option>\n`
                })
                selectTurnos += "</select>";

                // Agrego el select con las opciones a la seccion de turno
                seccionTurnos.innerHTML = selectTurnos;

                // Tomo el select de turnos para ver cuando cambia
                let turnoElegido = document.getElementById("turnoElegido");

                // Si se selecciona el turno, es decir se seleccionaron todos los campos, se habilita el boton para reservar
                turnoElegido.addEventListener("change", () => {
                    seccionBoton.innerHTML = `<button type="submit" class="btn btn-light btn-bd-light btn-block my-4" id='btnReservar'>Reservar</button>`

                    const btnReservar = document.getElementById('btnReservar');

                    btnReservar.addEventListener("click", () => {
                        const idAvionElegido = document.getElementById("avionElegido").value;
                        const diaElegido = document.getElementById("diaElegido").value;
                        const turnoElegido = document.getElementById("turnoElegido").value;

                        avionesDisponibles[idAvionElegido-1][diaElegido][turnoElegido] = false

                        const usuario = JSON.parse(sessionStorage["Usuario"]);
                        usuario.reservas.push({ "dia": diaElegido, "turno": turnoElegido });
                        sessionStorage.clear();
                        sessionStorage["logueado"] = true;
                        sessionStorage.setItem("Usuario", JSON.stringify(usuario));

                        let dia;
                        switch (diaElegido) {
                            case "lunes":
                                dia = {"lunes": avionesDisponibles[idAvionElegido-1][diaElegido]}
                                break;
                            case "martes":
                                dia = {"martes": avionesDisponibles[idAvionElegido-1][diaElegido]}
                                break;
                            case "miercoles":
                                dia = {"miercoles": avionesDisponibles[idAvionElegido-1][diaElegido]}
                                break;
                            case "jueves":
                                dia = {"jueves": avionesDisponibles[idAvionElegido-1][diaElegido]}
                                break;
                            case "viernes":
                                dia = {"viernes": avionesDisponibles[idAvionElegido-1][diaElegido]}
                                break;
                            default:
                                break;
                        }

                        fetch(API + '/' + idAvionElegido, {
                            method: 'PUT',
                            headers: { 'content-type': 'application/json' },
                            body: JSON.stringify(dia)
                        }).then(res => res.json()).then((dato) => {
                            console.log(dato)
                            fetch(API_USERS + '/' + usuario.id, {
                                method: 'PUT',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({ "reservas": usuario.reservas })
                            }).then(res => res.json()).then(dato => {
                                console.log(dato)
                                Toastify({
                                    text: "Turno reservado correctamente",
                                    position: "center",
                                    duration: 1500,
                                    style: {
                                        background: 'green'
                                    }
                            }).showToast();

                                setTimeout(() => {
                                    window.location = "../index.html"
                                }, 1500);
                            })
                                .catch(err => {
                                    console.log(err)
                                    Toastify({
                                        text: "Ha ocurrido un error al guardar el turno",
                                        position: "center",
                                        duration: 1500,
                                        style: {
                                            background: 'red'
                                        }
                                    }).showToast();
                                })
                        })
                            .catch(err => {
                                console.log(err)
                                Toastify({
                                    text: "Ha ocurrido un error al guardar el turno",
                                    position: "center",
                                    duration: 1500,
                                    style: {
                                        background: 'red'
                                    }
                            }).showToast();
                            })
                    })
                })
            })
        })
    })