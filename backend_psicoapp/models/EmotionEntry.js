const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emotionEntrySchema = new Schema({
    pacienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    dataRegistro: { type: Date, default: Date.now, required: true },
    humorGeral: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    emocoesEspecificas: [{ type: String, trim: true }],
    gatilhos: [{ type: String, trim: true }],
    atividades: [{ type: String, trim: true }],
    psicologaNotas: { type: String, trim: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('EmotionEntry', emotionEntrySchema);
