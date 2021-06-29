const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//creamos el servidor
const app  = express();

//conectamos a la base de datos
conectarDB();

//Habilitamos ExpressJSON
app.use( express.json({ extended: true}) );

//habilitar cors para poder intercambiar datos entre front y backen
app.use(cors());

//Se le asigna a la variable port el puerto de la variable de entorno port, en caso de que no exista se le asigna 4000
const port = process.env.port || 4000; 

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Definir la pagina principal ('/')
app.get('/', (req, res)=> {
    res.send('Hola Mundo!')
});

//Arrancamos el servidor
app.listen(port, '0.0.0.0', ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})