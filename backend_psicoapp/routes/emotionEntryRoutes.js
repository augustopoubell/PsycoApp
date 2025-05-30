const express = require('express');
const router = express.Router();
const emotionEntryController = require('../controllers/emotionEntryController');

router.get('/psicologa/all', emotionEntryController.getAllEntriesForPsychologist);
router.get('/paciente/:pacienteId', emotionEntryController.getEntriesByPatient);
router.post('/', emotionEntryController.createEntry);
router.get('/:id', emotionEntryController.getEntryById);
router.put('/:id', emotionEntryController.updateEntry);
router.delete('/:id', emotionEntryController.deleteEntry);

module.exports = router;
