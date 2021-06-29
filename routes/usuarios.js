//rutas para crear usuarios

//Importamos express para usar el router
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

//Crea un usuario
// api/usuarios en esa ruta lo vamos a enviar
router.post('/', 
    //definimos reglas de validacion al crear el usuario
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);

//exportamos el router para que este disponible en el index.js cuando hacemos : app.use('/api/usuarios', require('./routes/usuarios'));
module.exports = router;