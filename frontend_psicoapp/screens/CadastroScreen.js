// CadastroScreen.js
// Tela de registro de novos pacientes

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// AsyncStorage não é estritamente necessário aqui para o fluxo atual,
// mas se você fosse simular um "registro e login automático", precisaria dele.
// Para este exemplo, vamos manter a lógica de "registro e retorno ao login".

export default function CadastroScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState(''); // Novo campo para confirmação de senha
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    const registrar = async () => {
        // Validações básicas no frontend
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert('Erro de Cadastro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro de Cadastro', 'As senhas não coincidem.');
            return;
        }

        if (senha.length < 6) { // Exemplo de validação de senha
            Alert.alert('Erro de Cadastro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true); // Inicia o carregamento

        try {
            // Em uma aplicação real, você faria uma chamada à API para registrar o usuário.
            // Ex: const response = await api.post('/register', { nome, email, senha, tipo: 'paciente' });
            // console.log('Usuário registrado com sucesso:', response.data);

            // Simulando um tempo de processamento da API
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            // Se o registro fosse bem-sucedido na API:
            Alert.alert(
                'Sucesso',
                'Cadastro realizado com sucesso! Agora você pode fazer login.',
                [{ text: 'OK', onPress: () => navigation.goBack() }] // Volta para a tela de Login
            );

            // Opcional: Se você quisesse fazer login automático após o registro,
            // precisaria do `setUser` e `AsyncStorage` aqui, semelhante ao LoginScreen.
            // Por simplicidade e segurança, é comum exigir um login após o registro.

        } catch (error) {
            console.error('Erro ao tentar registrar:', error);
            Alert.alert('Erro de Cadastro', 'Ocorreu um erro ao tentar registrar. Tente novamente mais tarde.');
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Criar Nova Conta</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words" // Capitaliza as primeiras letras do nome
            />
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <Button title="Registrar" onPress={registrar} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#e6f0f2' // Consistente com LoginScreen
    },
    titulo: {
        fontSize: 28, // Consistente com LoginScreen
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333'
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd'
    }
});