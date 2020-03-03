let socket = io();

if(!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

// Escuchar
socket.on('connect', () => {
    console.log('Conectado al servidor...');

    socket.emit('entrarChat', usuario, (resp) => {
        // console.log(resp);
        renderizarUsuarios(resp);
    });
});

// socket.emit('crearMensaje', {
//     usuario: 'Camilo',
//     mensaje: 'Hola Mundo!'
// }, (resp) => {
//     console.log('Server:', resp);
// });

socket.on('crearMensaje', (resp) => {
    // console.log('Servidor:', resp);
    renderizarMensajes(resp);
    scrollBottom();
});

// Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersona', (personas) => {
    // console.log(personas);
    renderizarUsuarios(personas);
});

// Mensaje privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje privado', mensaje);
});

// socket.on('disconnect', function() {
//     // console.log('Perdimos conexión con el servidor');
// });


