const { io } = require('./../server');
const { Usuarios } = require('./../class/usuarios');
const { crearMensaje } = require('./../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', client => {
    // console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {
        // console.log(data);

        if(!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.personasPorSala(data.sala));

        callback(usuarios.personasPorSala(data.sala));
    });

    client.on('crearMensaje', data => {
        let usuario = usuarios.buscarPorID(client.id);
        let mensaje = crearMensaje(usuario.nombre, data.mensaje);

        client.broadcast.to(data.sala).emit('crearMensaje', mensaje);
    });

    // Mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.buscarPorID(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    })

    client.on('disconnect', () => {
        // console.log('Usuario desconectado...');

        let personaBorrada = usuarios.eliminarPersona(client.id);

        if(personaBorrada) {
            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
            client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.personasPorSala(personaBorrada.sala));
        }
    });
});