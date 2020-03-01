class Usuarios {
    constructor(id, nombre, sala) {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {id, nombre, sala};

        this.personas.push(persona);

        return this.personas;
    }

    buscarPorID(id) {
        if(id) {
            let persona = this.personas.find(persona => persona.id === id);
            // let persona = this.personas.filter(persona => persona.id === id)[0];
            return persona;
        }
    }

    getPersonas() {
        return this.personas;
    }

    personasPorSala(sala) {
        let personaSala = this.personas.filter(persona => persona.sala === sala);

        return personaSala;
    }

    eliminarPersona(id) {
        let personaBorrada = this.buscarPorID(id);

        this.personas = this.personas.filter(persona => persona.id !== id);

        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}