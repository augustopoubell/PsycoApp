import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminHome({ navigation, user, setUser }) {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const carregarPacientes = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            const mockPacientes = [
                { id: '1', nome: 'João da Silva', email: 'joao@example.com' },
                { id: '2', nome: 'Maria Oliveira', email: 'maria@example.com' },
                { id: '3', nome: 'Pedro Souza', email: 'pedro@example.com' },
                { id: '4', nome: 'Ana Costa', email: 'ana@example.com' },
            ];
            setPacientes(mockPacientes);
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
            Alert.alert('Erro', 'Não foi possível carregar a lista de pacientes.');
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        carregarPacientes();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                {user?.tipo === 'psicologa' ? `Olá, Dra. ${user.nome}` : `Olá, ${user.nome}`}
            </Text>

            <Text style={styles.subTitulo}>Lista de Pacientes:</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={pacientes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.itemContainer}>
                            <Text style={styles.itemNome}>{item.nome}</Text>
                            <Text style={styles.itemEmail}>{item.email}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum paciente encontrado.</Text>}
                />
            )}

            {}
            {user?.tipo === 'admin' && (
                <Button
                    title="Ver Histórico de Pagamentos"
                    onPress={() => navigation.navigate('HistoricoPagamentos')}
                    color="#28a745"
                />
            )}

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
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    subTitulo: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#555',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    itemNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
    },
    itemEmail: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    loadingIndicator: {
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
