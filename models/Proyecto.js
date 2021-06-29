const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador:{   
        type: mongoose.Schema.Types.ObjectId, //es el id del creador. Para saber donde encontrar ese ObjectId hay que pasarle la referencia
        ref: 'Usuario', //referencia que indica donde se encuentra el objectid, en Usuario
    },
    creado:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);