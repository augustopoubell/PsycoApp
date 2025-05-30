require('dotenv').config();
console.log('--- Iniciando app.js ---'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });

app.use(cors()); 
app.use(express.json());

const emotionEntryRoutes = require('./routes/emotionEntryRoutes');
app.use('/api/diario', emotionEntryRoutes);

const authRoutes = require('./routes/authRoutes'); 
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
    res.send('API de Psicologia está rodando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
