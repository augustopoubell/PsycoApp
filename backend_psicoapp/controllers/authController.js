const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

exports.registerUser = async (req, res) => {
    try {
        const { nome, email, senha, tipoUsuario, dataNascimento } = req.body;

        if (!nome || !email || !senha || !tipoUsuario) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios (nome, email, senha, tipoUsuario) devem ser preenchidos.' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        user = new User({
            nome,
            email,
            senha: hashedPassword, 
            tipoUsuario,
            dataNascimento
        });
        await user.save();

        const token = jwt.sign({ userId: user._id, tipoUsuario: user.tipoUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            userId: user._id,
            email: user.email,
            tipoUsuario: user.tipoUsuario,
            nome: user.nome, 
            token 
        });

    } catch (err) {
        console.error("Erro ao registrar usuário:", err);
        res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign(
            { userId: user._id, tipoUsuario: user.tipoUsuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

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

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-senha');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Erro ao obter usuário por ID:", err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de usuário inválido.' });
        }
        res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
};
