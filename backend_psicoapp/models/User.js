const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    senha: { 
        type: String,
        required: true
    },
    tipoUsuario: {
        type: String,
        enum: ['paciente', 'psicologo'],
        default: 'paciente',
        required: true
    },
    dataNascimento: {
        type: Date
    },
    
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
