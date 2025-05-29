// AdminHome.js
// Tela de administração (para Admin e Psicóloga), lista pacientes fictícios e acesso ao histórico de pagamento.

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage

export default function AdminHome({ navigation, user, setUser }) { // Adicionado 'user' e 'setUser'
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função para simular o carregamento de pacientes
    const carregarPacientes = async () => {
        setLoading(true);
        try {
            // Em uma aplicação real, você faria uma chamada à API aqui:
            // const response = await api.get('/admin/pacientes', { headers: { Authorization: `Bearer ${user.token}` } });
            // setPacientes(response.data);

            // Simulação de dados e atraso de rede
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da rede

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

    // Carrega pacientes quando o componente é montado
    useEffect(() => {
        carregarPacientes();
    }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

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

            {/* Acesso ao histórico de pagamentos apenas para o Admin */}
            {user?.tipo === 'admin' && (
                <Button
                    title="Ver Histórico de Pagamentos"
                    onPress={() => navigation.navigate('HistoricoPagamentos')}
                    color="#28a745" // Cor diferente para o botão
                />
            )}

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
        padding: 20,
        backgroundColor: '#f0f4f8', // Fundo mais suave
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
        shadowColor: '#000', // Sombra para dar profundidade
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // Elevação para Android
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
        backgroundColor: '#dc3545', // Cor vermelha para logout
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