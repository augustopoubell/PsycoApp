// controllers/emotionEntryController.js
const EmotionEntry = require('../models/EmotionEntry');
const User = require('../models/User'); // Importe o modelo User se ainda não o fez, para usar no populate

exports.createEntry = async (req, res) => {
    try {
        const newEntry = new EmotionEntry(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        console.error("Erro ao criar registro:", err);
        res.status(400).json({ message: err.message });
    }
};

exports.getEntriesByPatient = async (req, res) => {
    try {
        if (!req.params.pacienteId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID do paciente inválido.' });
        }
        const entries = await EmotionEntry.find({ pacienteId: req.params.pacienteId })
                                        .populate('pacienteId', 'nome email')
                                        .sort({ dataRegistro: -1 });
        
        if (!entries || entries.length === 0) {
            return res.status(404).json({ message: 'Nenhum registro de diário encontrado para este paciente.' });
        }
        res.json(entries);
    } catch (err) {
        console.error("Erro ao buscar registros do paciente:", err);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar diários do paciente.', error: err.message });
    }
};

exports.getEntryById = async (req, res) => {
    try {
        const entry = await EmotionEntry.findById(req.params.id).populate('pacienteId', 'nome email');
        if (!entry) {
            return res.status(404).json({ message: 'Registro não encontrado.' });
        }
        res.json(entry);
    } catch (err) {
        console.error("Erro ao buscar registro por ID:", err);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar registro por ID.', error: err.message });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const updatedEntry = await EmotionEntry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Registro não encontrado para atualização.' });
        }
        res.json(updatedEntry);
    } catch (err) {
        console.error("Erro ao atualizar registro:", err);
        res.status(400).json({ message: 'Erro ao atualizar o registro.', error: err.message });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const deletedEntry = await EmotionEntry.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Registro não encontrado para exclusão.' });
        }
        res.json({ message: 'Registro excluído com sucesso!' });
    } catch (err) {
        console.error("Erro ao excluir registro:", err);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir registro.', error: err.message });
    }
};

// --- NOVA FUNÇÃO A SER ADICIONADA ---
exports.getAllEntriesForPsychologist = async (req, res) => {
    try {
        // Busca TODOS os registros de diário de TODOS os pacientes
        // E popula as informações do paciente (nome e email)
        const allDiaries = await EmotionEntry.find()
                                            .populate('pacienteId', 'nome email') // Popula o campo pacienteId
                                            .sort({ dataRegistro: -1 }); // Ordena do mais novo para o mais antigo
        
        if (!allDiaries || allDiaries.length === 0) {
            // Retorna um array vazio com status 200 se não houver registros
            return res.status(200).json([]); 
        }
        res.status(200).json(allDiaries);
    } catch (error) {
        console.error('Erro ao buscar todos os diários para psicóloga:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar todos os diários.', error: error.message });
    }
};