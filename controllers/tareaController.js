const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');//necesitamos importar tambien el modelo del proyecto porque insertamos las tareas en proyectos
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }


    try {
        
        // Extraer el poryecto y comprobar si existe   
        const { proyecto } = req.body;

        const existeproyecto = await Proyecto.findById(proyecto);
        if(!existeproyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto, tiene que ser la misma que la que esta autenticada
        if( existeproyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Creador de la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();//funcion de mongoose para guardar la tarea en la BD
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas por proyecto

exports.obtenerTareas = async (req, res) => {

    try {
        //Extraemos proyecto, al ser una funcion get se lo hemos pasado mediante params por lo que no podemos hacer req.body para extraer el proyecto
        // const { proyecto } = req.body;
        //se debe extraer con req.query
        const { proyecto } = req.query;

        const existeproyecto = await Proyecto.findById(proyecto);
        if(!existeproyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto, tiene que ser la misma que la que esta autenticada
        if( existeproyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }


        //Obtener las tareas por proyecto. En el campo proyecto sea igual al proyecto que le pasamos
        //es lo mismo que poner proyecto: proyecto
        //ordenamos por el atributo creado que contiene la fecha y de orden descendente
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1});
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const { proyecto, nombre, estado } = req.body;


        // Verificar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        const existeproyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto, tiene que ser la misma que la que esta autenticada
        if( existeproyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }

        if (tarea.proyecto.toString() !== proyecto) {
            return res.status(401).json({msg: 'Tarea no pertenece a este proyecto'});
        }
        
        // Crear un objeto con la nueva informacion 
        const nuevatarea = {};
        nuevatarea.nombre = nombre;
        nuevatarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevatarea ,{new: true});

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


//Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto } = req.query;

        // Verificar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //extraer proyecto
        const existeproyecto = await Proyecto.findById(proyecto);
        //Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto, tiene que ser la misma que la que esta autenticada
        if( existeproyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }

        if (tarea.proyecto.toString() !== proyecto) {
            return res.status(401).json({msg: 'Tarea no pertenece a este proyecto'});
        }
        
        //Eliminar
        tarea = await Tarea.findOneAndRemove({_id: req.params.id});

        res.json({ msg: 'Tarea Eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}