// routes/emotionEntryRoutes.js (Versão FINAL)

const express = require('express');
const router = express.Router();
const emotionEntryController = require('../controllers/emotionEntryController');
// const authMiddleware = require('../middleware/authMiddleware'); // Lembre-se de adicionar middleware de autenticação/autorização aqui quando tiver!

// --- Rotas mais específicas devem vir primeiro ---

// 1. Rota para buscar diários de TODOS os pacientes (para a psicóloga)
// Endpoint: GET /api/diario/psicologa/all
router.get('/psicologa/all', emotionEntryController.getAllEntriesForPsychologist);

// 2. Rota para buscar diários de UM PACIENTE ESPECÍFICO
// Endpoint: GET /api/diario/paciente/:pacienteId
router.get('/paciente/:pacienteId', emotionEntryController.getEntriesByPatient);

// --- Rotas genéricas para operações CRUD em um ÚNICO registro de diário ---
// Endpoint: POST /api/diario
router.post('/', emotionEntryController.createEntry);

// Endpoint: GET /api/diario/:id (para buscar um registro de diário pelo SEU PRÓPRIO ID)
router.get('/:id', emotionEntryController.getEntryById);

// Endpoint: PUT /api/diario/:id
router.put('/:id', emotionEntryController.updateEntry);

// Endpoint: DELETE /api/diario/:id
router.delete('/:id', emotionEntryController.deleteEntry);

module.exports = router;