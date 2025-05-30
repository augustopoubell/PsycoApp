import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';

const API_PAGAMENTOS_URL = 'http://192.168.1.88:5000/api/pagamentos'; 

export default function HistoricoPagamentos({ route, navigation }) {
    const [pagamentos, setPagamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const carregarPagamentos = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1800)); 
            const mockPagamentos = [
                { id: '1', paciente: 'João da Silva', valor: 'R$ 150,00', data: '01/05/2024' },
                { id: '2', paciente: 'Maria Oliveira', valor: 'R$ 150,00', data: '10/05/2024' },
                { id: '3', paciente: 'Pedro Souza', valor: 'R$ 160,00', data: '15/05/2024' },
                { id: '4', paciente: 'Ana Costa', valor: 'R$ 140,00', data: '20/05/2024' },
                { id: '5', paciente: 'João da Silva', valor: 'R$ 150,00', data: '25/04/2024' },
                { id: '6', paciente: 'Maria Oliveira', valor: 'R$ 150,00', data: '05/04/2024' },
            ];
            setPagamentos(mockPagamentos);
        } catch (error) {
            console.error('Erro ao carregar histórico de pagamentos: ', error);
            Alert.alert('Erro', 'Não foi possível carregar o histórico de pagamentos.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        carregarPagamentos();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.paymentCard}>
            <Text style={styles.cardPaciente}>{item.paciente}</Text>
            <View style={styles.cardDetails}>
                <Text style={styles.cardValor}>{item.valor}</Text>
                <Text style={styles.cardData}>{item.data}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Carregando histórico de pagamentos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Histórico de Pagamentos</Text>
            {pagamentos.length === 0 ? (
                <Text style={styles.noRecordsText}>Nenhum registro de pagamento encontrado.</Text>
            ) : (
                <FlatList
                    data={pagamentos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    style={styles.list}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
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
        textAlign: 'center',
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    list: {
        flex: 1,
    },
    paymentCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#007BFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    cardPaciente: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardValor: {
        fontSize: 16,
        fontWeight: '600',
        color: '#28a745', 
    },
    cardData: {
        fontSize: 14,
        color: '#888',
    },
    noRecordsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
        fontStyle: 'italic',
    }
});
