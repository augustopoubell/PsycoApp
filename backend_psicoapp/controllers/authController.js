// backend_psicoapp/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Para hash de senhas
const jwt = require('jsonwebtoken'); // Para JSON Web Tokens

// Certifique-se de ter um JWT_SECRET no seu .env (uma string aleatória longa)
// Exemplo: JWT_SECRET=sua_chave_secreta_super_longa_e_aleatoria_aqui_para_jwt

// --- Função para Registrar um Novo Usuário ---
exports.registerUser = async (req, res) => {
    try {
        const { nome, email, senha, tipoUsuario, dataNascimento } = req.body;

        // Validação básica
        if (!nome || !email || !senha || !tipoUsuario) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios (nome, email, senha, tipoUsuario) devem ser preenchidos.' });
        }

        // Verificar se o usuário já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        // Hash da senha antes de salvar (MUITO IMPORTANTE para segurança!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria e salva o novo usuário
        user = new User({
            nome,
            email,
            senha: hashedPassword, // Salva a senha HASHED
            tipoUsuario,
            dataNascimento
        });
        await user.save();

        // Opcional: Gerar um token no registro também, se quiser logar o usuário automaticamente
        const token = jwt.sign({ userId: user._id, tipoUsuario: user.tipoUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            userId: user._id,
            email: user.email,
            tipoUsuario: user.tipoUsuario,
            nome: user.nome, // Inclui o nome para o frontend
            token // Envia o token
        });

    } catch (err) {
        console.error("Erro ao registrar usuário:", err);
        res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
};

// --- Função para Login de Usuário ---
exports.loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Validar inputs
        if (!email || !senha) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
        }

        // 2. Encontrar usuário por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        // 3. Comparar senha (usando bcrypt)
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        // 4. Gerar JWT Token
        const token = jwt.sign(
            { userId: user._id, tipoUsuario: user.tipoUsuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // 5. Retornar token e informações do usuário (sem a senha hashed)
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token,
            userId: user._id,
            nome: user.nome,
            tipoUsuario: user.tipoUsuario
        });

    } catch (err) {
        console.error("Erro ao fazer login:", err);
        res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
};

// --- Função para Obter Detalhes de um Usuário por ID (get_user) ---
exports.getUserById = async (req, res) => {
    try {
        // req.params.id virá da URL (ex: /api/auth/users/:id)
        const user = await User.findById(req.params.id).select('-senha'); // Retorna o usuário, excluindo o campo senha
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Erro ao obter usuário por ID:", err);
        // Se o ID não for um ObjectId válido, o Mongoose lança um CastError, que é um 500
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de usuário inválido.' });
        }
        res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
};