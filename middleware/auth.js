const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //Vamos a leer el token del header
    const token = req.header('x-auth-token');

    //Revisar si no hay token
    if(!token){
        return res.status(401).json({msg: 'No hay token, permiso no válido'});
    }

    //validar token
    try {
        //verificamos que el token es correcto y esta activo
        const cifrado = jwt.verify(token, process.env.SECRETA);
        //guardamos en req el usuario que contiene cifrado que contiene quien lo ha creado
        req.usuario = cifrado.usuario;
        next();//ejecuta el siguiente middleware
    } catch (error) {
        res.status(401).json({msg: 'Token no es válido'});
    }
}