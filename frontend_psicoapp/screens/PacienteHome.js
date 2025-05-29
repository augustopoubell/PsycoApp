// PacienteHome.js
// Tela inicial do paciente com acesso ao diário emocional e funcionalidade de logout.

import React from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage

export default function PacienteHome({ navigation, user, setUser }) { // Adicionado 'setUser'
    // Função de logout
    const handleLogout = async () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear(); // Limpa todos os dados do AsyncStorage
                            setUser(null); // Define o usuário como nulo, o que fará o App.js voltar para a tela de login
                        } catch (error) {
                            console.error('Erro ao fazer logout:', error);
                            Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Olá, {user?.nome || 'Paciente'}</Text>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('DiarioEmocional')}
            >
                <Text style={styles.buttonText}>Meu Diário Emocional</Text>
            </TouchableOpacity>

            {/* Botão de Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8', // Fundo consistente com AdminHome
    },
    titulo: {
        fontSize: 26, // Tamanho consistente
        fontWeight: 'bold', // Peso da fonte consistente
        marginBottom: 40, // Margem maior para separar do botão
        color: '#333', // Cor consistente
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF', // Cor primária para o botão principal
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginBottom: 20,
        width: '80%', // Largura do botão
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#dc3545', // Cor vermelha para logout, consistente com AdminHome
        padding: 12,
        borderRadius: 8,
        marginTop: 30, // Mais margem para separar do botão principal
        width: '80%',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});