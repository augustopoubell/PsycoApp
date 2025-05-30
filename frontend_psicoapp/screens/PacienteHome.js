import React from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function PacienteHome({ navigation, user, setUser }) {
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
                            await AsyncStorage.clear(); 
                            setUser(null);
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

            {}
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
        backgroundColor: '#f0f4f8',
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold', 
        marginBottom: 40, 
        color: '#333',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF', 
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginBottom: 20,
        width: '80%', 
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
        backgroundColor: '#dc3545', 
        padding: 12,
        borderRadius: 8,
        marginTop: 30, 
        width: '80%',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
