const Usuario = require('../models/Usuario');
const bcryptsjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
//se necesita crear un jwt porque en react no hay sesiones como hay con php 

exports.crearUsuario = async (req, res) => {
    
    //revisar si hay errores
    //devuelve si el req incumple alguna de las reglas definidas
    const errores = validationResult(req);

    //las reglas se definen en el router y en el controller se leen 
    if(!errores.isEmpty()){//si tiene algo es que continee errores
        return res.status(400).json({errores: errores.array()});
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar que el usuario registrado sea unico. Busca en la base de datos, en la tabla Usuarios si hay un email igual
        //los email son distintos en cada usuario, unicos
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe'});
        }

        //crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptsjs.genSalt(10);//en caso de que hayan dos contraseñas iguales hace un salto
        usuario.password = await bcryptsjs.hash(password, salt);//(string que hasheamos, funcion hash)

        //guardar usuario
        await usuario.save();

        //Crear y firmar el jason web token
        //Tendremos un token con el id del usuario, cuando inicie sesion en la web, acccedemos a la BD y con ese id sabremos cuales son sus proyectos
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
        res.status(400).send('Hubo un error');
    }

}