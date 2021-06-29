//rutas para crear usuarios

//Importamos express para usar el router
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Iniciar sesion
// api/auth en esa ruta lo vamos a enviar
router.post('/', 
    //definimos reglas de validacion al crear el usuario
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

//exportamos el router para que este disponible en el index.js cuando hacemos : app.use('/api/usuarios', require('./routes/usuarios'));
module.exports = router;