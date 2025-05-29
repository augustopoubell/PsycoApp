// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage

export default function LoginScreen({ navigation, setUser }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false); // Novo estado para controlar o carregamento

    const fazerLogin = async () => { // Função assíncrona para usar await
        setLoading(true); // Inicia o carregamento

        try {
            // Simulação de autenticação com base em e-mail e senha
            // Em uma aplicação real, você faria uma chamada à API aqui
            // Ex: const response = await api.post('/login', { email, senha });
            // const userData = response.data;

            let userData = null;
            let userToken = 'mock-token-123'; // Token simulado. Em um cenário real, viria do backend.

            if (email === 'admin@clinica.com' && senha === '123456') {
                userData = { id: '1', nome: 'Administrador', tipo: 'admin', token: userToken };
            } else if (email === 'psicologa@clinica.com' && senha === '123456') {
                userData = { id: '2', nome: 'Dra. Psicóloga', tipo: 'psicologa', token: userToken };
            } else if (email === 'paciente@clinica.com' && senha === '123456') {
                userData = { id: '3', nome: 'Paciente', tipo: 'paciente', token: userToken };
            }

            if (userData) {
                // Se a autenticação for bem-sucedida, armazene os dados no AsyncStorage
                await AsyncStorage.setItem('userId', userData.id);
                await AsyncStorage.setItem('userName', userData.nome);
                await AsyncStorage.setItem('userType', userData.tipo);
                await AsyncStorage.setItem('userToken', userData.token); // Armazenar o token

                // Atualiza o estado do usuário no App.js
                setUser(userData);
            } else {
                Alert.alert('Erro', 'E-mail ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
        } finally {
            setLoading(false); // Finaliza o carregamento, independentemente do resultado
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address" // Sugestão para tipo de teclado
                autoCapitalize="none" // Desativa a capitalização automática
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <Button title="Entrar" onPress={fazerLogin} />
            )}
            
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.link}>Registrar-se</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Recuperação de senha', 'Instruções enviadas por e-mail.')}>
                <Text style={styles.link}>Esqueceu a senha?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#e6f0f2'
    },
    titulo: {
        fontSize: 28, // Aumentei o tamanho do título para destaque
        fontWeight: 'bold',
        marginBottom: 30, // Aumentei a margem inferior
        textAlign: 'center', // Centralizar o título
        color: '#333'
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15, // Adicionado padding horizontal
        paddingVertical: 12, // Adicionado padding vertical
        marginBottom: 15, // Aumentei a margem inferior
        borderRadius: 8, // Aumentei o arredondamento
        fontSize: 16, // Aumentei o tamanho da fonte
        borderWidth: 1,
        borderColor: '#ddd'
    },
    link: {
        color: '#007BFF',
        marginTop: 15, // Aumentei a margem superior
        textAlign: 'center',
        fontSize: 15 // Aumentei o tamanho da fonte
    }
});