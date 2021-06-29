const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crea Proyectos
// api/auth
//verifica lo que tenemos en auth y si todo va bien crea el proyecto
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

//obtener todos los proyectos
router.get('/', 
    auth,
    proyectoController.obtenerProyectos
);

//actualizar proyecto via ID
router.put('/:id', 
    auth,//revisamos que el usuario este autenticado
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],//comprobamos que el proyecto tenga un nombre
    proyectoController.actualizarProyecto//finalmente se agrega en el middleware
);

//Eliminar un Proyecto
router.delete('/:id', 
    auth,//revisamos que el usuario este autenticado
    proyectoController.eliminarProyecto//finalmente se agrega en el middleware
);
module.exports = router;