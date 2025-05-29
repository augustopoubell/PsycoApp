// models/User.js
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
        unique: true, // Garante que cada e-mail seja único
        trim: true,
        lowercase: true
    },
    senha: { // Guarde a senha HASHED, NUNCA em texto puro!
        type: String,
        required: true
    },
    tipoUsuario: { // Para distinguir entre "paciente" e "psicologo"
        type: String,
        enum: ['paciente', 'psicologo'], // Valores permitidos
        default: 'paciente',
        required: true
    },
    dataNascimento: {
        type: Date
    },
    // Adicione outros campos que você considere relevantes para um usuário/paciente
    // Por exemplo, informações de contato, etc.
}, {
    timestamps: true // Adiciona createdAt e updatedAt
});

// Opcional: Adicionar um middleware para hash de senha antes de salvar
// Isso requer uma biblioteca como 'bcryptjs'.
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('senha')) {
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.senha = await bcrypt.hash(this.senha, salt);
//     next();
// });

module.exports = mongoose.model('User', userSchema);