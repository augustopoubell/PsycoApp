import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function LoginScreen({ navigation, setUser }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false); 

    const fazerLogin = async () => { 
        setLoading(true); 

        try {
            let userData = null;
            let userToken = 'mock-token-123'; 
            if (email === 'admin@clinica.com' && senha === '123456') {
                userData = { id: '1', nome: 'Administrador', tipo: 'admin', token: userToken };
            } else if (email === 'psicologa@clinica.com' && senha === '123456') {
                userData = { id: '2', nome: 'Dra. Psicóloga', tipo: 'psicologa', token: userToken };
            } else if (email === 'paciente@clinica.com' && senha === '123456') {
                userData = { id: '3', nome: 'Paciente', tipo: 'paciente', token: userToken };
            }

            if (userData) {
                await AsyncStorage.setItem('userId', userData.id);
                await AsyncStorage.setItem('userName', userData.nome);
                await AsyncStorage.setItem('userType', userData.tipo);
                await AsyncStorage.setItem('userToken', userData.token);
                setUser(userData);
            } else {
                Alert.alert('Erro', 'E-mail ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
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
        fontSize: 28, 
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
    },
    link: {
        color: '#007BFF',
        marginTop: 15, 
        textAlign: 'center',
        fontSize: 15
    }
});
