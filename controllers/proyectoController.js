const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //revisar si hay errores
    //devuelve si el req incumple alguna de las reglas definidas
    const errores = validationResult(req);

    //las reglas se definen en el router y en el controller se leen 
    if(!errores.isEmpty()){//si tiene algo es que continee errores
        return res.status(400).json({errores: errores.array()});
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardr el creador via JWT
        //En el middleware auth.js, hemos guardado cifrado.usuario que contiene el usuario que ha creado el proyecto y lo guardabamos en req/
        //queremos saber su id por eso directamente sacamos su id
        proyecto.creador = req.usuario.id;

        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        //guardamos en proyectos todos los proyectos del creador 
        //con el sort se puede cambiar el orden
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1});
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el id del proyecto
        //Cogemos el proyecto de la BD que contiene la id que le pasamos por parametro
        let proyecto = await Proyecto.findById(req.params.id);

        //Existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto, tiene que ser la misma que la que esta autenticada
        if( proyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Actualizar con $set. New:true es para crear una instancia y poder usar la propiedad del objeto $set y poder crear un nuevo proyecto en la BD
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, { $set: nuevoProyecto}, {new: true});

        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

//elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el id del proyecto
        //Cogemos el proyecto de la BD que contiene la id que le pasamos por parametro
        let proyecto = await Proyecto.findById(req.params.id);

        //Existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto, tiene que ser la misma que la que esta autenticada
        if( proyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id});

        res.json({msg: 'Proyecto eliminado'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}