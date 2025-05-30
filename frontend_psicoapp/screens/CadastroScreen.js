import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';

export default function CadastroScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const registrar = async () => {
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert('Erro de Cadastro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro de Cadastro', 'As senhas não coincidem.');
            return;
        }

        if (senha.length < 6) {
            Alert.alert('Erro de Cadastro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true); 
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            Alert.alert(
                'Sucesso',
                'Cadastro realizado com sucesso! Agora você pode fazer login.',
                [{ text: 'OK', onPress: () => navigation.goBack() }] 
            );

        } catch (error) {
            console.error('Erro ao tentar registrar:', error);
            Alert.alert('Erro de Cadastro', 'Ocorreu um erro ao tentar registrar. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
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
                autoCapitalize="words" 
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
    }
});
