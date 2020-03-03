let params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre');
let sala = params.get('sala');

let divUsuarios = document.getElementById('divUsuarios');
// let divChatbox = document.getElementById('divChatbox');
let divChatbox = $('#divChatbox');
let formEnviar =  document.getElementById('formEnviar');
let txtMensaje = document.getElementById('txtMensaje');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
    console.log(personas);

    let html = '<li class="animated fadeIn">';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';


    for (let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +'<small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    
    if(divUsuarios) {
        divUsuarios.innerHTML = html;
    }
}

function renderizarMensajes(mensaje, yo = false) {

    let html = '';
    let fecha = new Date(mensaje.fecha);
    let hora = `${fecha.getHours()}:${fecha.getMinutes()}`;
    
    let clase = 'info';

    if(mensaje.nombre === 'Administrador') clase = 'danger';

    if (yo) {
        html += '<li class="reverse animated fadeIn">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }else {
        html += '<li class="animated fadeIn">';

        if(mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-'+ clase +'">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    if(divChatbox) {
        // Con jQuery para ejecutar luego la función scrollBottom();
        divChatbox.append(html);
    }
}

// Función con jQuery <-- remplazar en un futuro a solo JavaScript
function scrollBottom() {
    // selectors - tiene que ser tomado con jQuery la referencia al divChatbox
    let newMessage = divChatbox.children('li:last-child');

    // heights
    let clientHeight = divChatbox.prop('clientHeight');
    let scrollTop = divChatbox.prop('scrollTop');
    let scrollHeight = divChatbox.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

divUsuarios.onmouseover = () => {
    let anchors =  divUsuarios.querySelectorAll('a');
    
    if(anchors.length > 0) {
        // Listeners
        for (let i = 0; i < anchors.length; i++) 
        {
            anchors[i].onclick = (e) => {
                if(anchors[i].getAttribute('data-id'))
                {
                    console.log(anchors[i].getAttribute('data-id'));
                }
            }
        }    
    }
}

formEnviar.onsubmit = (e) => {
    e.preventDefault();

    // Para validar
    let mensaje = txtMensaje.value;

    if(mensaje.trim().length === 0) {
        return;
    }
    
    socket.emit('crearMensaje', {
        nombre,
        mensaje
    }, (resp) => {
        // console.log(resp);
        txtMensaje.value = '';
        txtMensaje.focus();
        renderizarMensajes(resp, true);
        scrollBottom();
    });
}