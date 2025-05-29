// frontend_psicoapp/screens/PsyViewScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native'; // Adicionado RefreshControl

// ATENÇÃO: Substitua 'SEU_ENDERECO_IP' pelo IP da sua máquina e a porta do seu backend!
const API_PSY_URL = 'http://192.168.1.88:5000/api/diario/psicologa/all'; // Endpoint para psicóloga

export default function PsyViewScreen({ user }) { // Recebe user, que contém o token
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Novo estado para RefreshControl

    // Pega o token do usuário logado
    const userToken = user ? user.token : null;

    // Emojis para o humor, consistente com DiarioEmocional
    const humorEmojis = {
        'Muito Feliz': '😄', 'Feliz': '😊', 'Neutro': '😐', 'Triste': '😞',
        'Ansioso': '😟', 'Irritado': '😡', 'Cansado': '😴', 'Grato': '🙏'
    };

    useEffect(() => {
        if (userToken) { // Só busca os registros se o token estiver disponível
            fetchPsyRecords();
        } else {
            setLoading(false);
            Alert.alert('Erro de Autenticação', 'Token de psicóloga não disponível. Por favor, faça login novamente.');
            // Opcional: navigation.navigate('Login'); para forçar o login
        }
    }, [userToken]); // Adicionei userToken como dependência

    const fetchPsyRecords = async () => {
        setLoading(true);
        setRefreshing(true); // Ativa o refresh indicator
        try {
            // Enviando o token de autenticação da psicóloga no header 'Authorization'
            const response = await fetch(API_PSY_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Token da psicóloga
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            setAllRecords(data);
        } catch (error) {
            console.error('Erro ao carregar registros para a psicóloga: ', error);
            Alert.alert('Erro', `Não foi possível carregar os registros: ${error.message}`);
            setAllRecords([]); // Limpa os registros em caso de erro
        } finally {
            setLoading(false);
            setRefreshing(false); // Desativa o refresh indicator
        }
    };

    const renderRecordItem = ({ item }) => (
        <View style={styles.recordCard}>
            {/* Exibe informações do paciente (graças ao .populate() no backend) */}
            <Text style={styles.patientInfo}>
                Paciente: <Text style={styles.patientName}>{item.pacienteId?.nome || 'Desconhecido'}</Text> 
                {item.pacienteId?.email ? ` (${item.pacienteId.email})` : ''}
            </Text>
            <Text style={styles.recordDate}>
                Data: {new Date(item.dataRegistro).toLocaleDateString('pt-BR')} às{' '}
                {new Date(item.dataRegistro).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </Text>
            <Text style={styles.recordHumor}>
                Humor: {humorEmojis[item.humorGeral] || item.humorGeral}
            </Text>
            <Text style={styles.recordDescription}>Pensamentos: {item.descricao}</Text>
            {item.psicologaNotas && <Text style={styles.psychologistNotes}>Notas da Psicóloga: {item.psicologaNotas}</Text>}
        </View>
    );

    if (loading && !refreshing) { // Mostra o loading inicial apenas
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a0dad" />
                <Text style={styles.loadingText}>Carregando registros de pacientes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Diários dos Pacientes</Text>
            {allRecords.length === 0 ? (
                <Text style={styles.noRecordsText}>Nenhum registro de diário encontrado. {"\n"}Puxe para baixo para recarregar.</Text>
            ) : (
                <FlatList
                    data={allRecords}
                    keyExtractor={(item) => item._id}
                    renderItem={renderRecordItem}
                    style={styles.list}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={ // Adiciona funcionalidade de "pull-to-refresh"
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchPsyRecords}
                            colors={['#6a0dad']} // Cor do spinner de refresh
                            tintColor={'#6a0dad'} // Cor do spinner no iOS
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8', // Fundo consistente
        paddingTop: 40, // Ajuste para mais espaço no topo
    },
    title: {
        fontSize: 28, // Tamanho consistente
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
    recordCard: {
        backgroundColor: '#fff',
        padding: 18, // Mais padding
        borderRadius: 10, // Mais arredondado
        marginBottom: 12, // Mais margem
        borderLeftWidth: 6, // Borda mais proeminente
        borderLeftColor: '#6a0dad', // Cor principal do app (roxo)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, // Sombra mais visível
        shadowRadius: 4,
        elevation: 5,
    },
    patientInfo: {
        fontSize: 17, // Ligeiramente maior
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#212529',
    },
    patientName: {
        color: '#4a4a4a', // Cor para o nome do paciente
        fontWeight: 'normal',
    },
    recordDate: {
        fontSize: 13, // Tamanho consistente
        color: '#6c757d',
        marginBottom: 8, // Mais espaço
        fontStyle: 'italic',
    },
    recordHumor: {
        fontSize: 16, // Ligeiramente maior
        fontWeight: '600',
        marginBottom: 8, // Mais espaço
        color: '#495057',
    },
    recordDescription: {
        fontSize: 15, // Ligeiramente maior
        color: '#343a40',
        lineHeight: 22, // Melhorar legibilidade
        marginTop: 5,
    },
    psychologistNotes: {
        fontSize: 14, // Ligeiramente maior
        fontStyle: 'italic',
        marginTop: 10,
        color: '#007bff', // Cor azul para notas da psicóloga
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingTop: 10,
    },
    noRecordsText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#777',
        fontStyle: 'italic',
        lineHeight: 24,
    },
    list: {
        // Estilos para a FlatList, pode adicionar um padding interno se necessário
    }
});