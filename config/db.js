const mongoose = require('mongoose');

//cargamos dotenv y le decimos que las variables de entorno estan en variables.env
require('dotenv').config({ path: 'variables.env'});

const conectarDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO,{
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log('DB Conectada');
        
    }catch(error){
        console.log(error);
        process.exit(1); //Detiene la app
    }
}

module.exports = conectarDB;