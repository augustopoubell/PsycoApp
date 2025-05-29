// app.js (ou server.js) na pasta backend_psicoapp_node/

require('dotenv').config(); // Carrega as variáveis de ambiente do .env
console.log('--- Iniciando app.js ---'); // Adicione este

const express = require('express');
const mongoose = require('mongoose'); // Importa o Mongoose
const cors = require('cors'); // Importa o CORS

const app = express();

// --- Conexão com o MongoDB ---
mongoose.connect(process.env.MONGO_URI) // Usa a string de conexão do .env
    .then(() => {
        console.log('MongoDB conectado com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
        // process.exit(1); // Encerra a aplicação se a conexão falhar
    });

// --- Middlewares ---
app.use(cors()); // Permite que seu app React Native se conecte
app.use(express.json()); // Para parsear o corpo das requisições JSON

// --- Rotas da API (você vai criar esses arquivos) ---
// Exemplo: Rotas para o diário emocional
const emotionEntryRoutes = require('./routes/emotionEntryRoutes');
app.use('/api/diario', emotionEntryRoutes);

const authRoutes = require('./routes/authRoutes'); 
app.use('/api/auth', authRoutes); 

// Rota de teste simples para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('API de Psicologia está rodando!');
});

// --- Iniciar o Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`); // Para testar no navegador/Postman
});