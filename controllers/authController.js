const Usuario = require('../models/Usuario');
const bcryptsjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
//se necesita crear un jwt porque en react no hay sesiones como hay con php 

exports.autenticarUsuario = async (req, res) => {
    //revisar si hay errores
    //devuelve si el req incumple alguna de las reglas definidas
    const errores = validationResult(req);

    //las reglas se definen en el router y en el controller se leen 
    if(!errores.isEmpty()){//si tiene algo es que continee errores
        return res.status(400).json({errores: errores.array()});
    }

    //extraer el email y password
    const { email, password } = req.body;

    try {
        //revisar que hay un usuario que tiene ese email, usuario registrado
        let usuario = await Usuario.findOne( { email });
        if(!usuario){
            return res.status(400).json({ msg: 'El usuario no existe'});
        }

        //el usuario existe, revisamos su pass
        //compara el password que le pasamos atraves del formulario con el password guardado en la BD
        const passCorrecto = await bcryptsjs.compare(password, usuario.password)
        if(!passCorrecto){
            return res.status(400).json({ msg: 'Password incorrecto'});
        }

        //todo es correcto, creamos JWT y firmamos
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el JWT
        //le pasamos el payload (la informacion), la firma, el tiempo que tarda en expirar el token (1h) y una funcion que revisa si hay un error
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1 h en segundos
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json({ token: token});
        });
        
    } catch (error) {
        console.log(error);
    }
}

exports.usuarioAutenticado = async (req, res) => {
    try {
        //cogemos los datos del usuario que coincida la id que se ha autenticado en el middleware, cogemos todos los atributos menos el password
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(eror);
        res.status(500).json({msg: 'Hubo un error'});
    }
}