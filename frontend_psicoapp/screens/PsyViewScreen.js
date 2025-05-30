import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';

const API_PSY_URL = 'http://192.168.1.88:5000/api/diario/psicologa/all'; 

export default function PsyViewScreen({ user }) { 
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); 
    const userToken = user ? user.token : null;
    const humorEmojis = {
        'Muito Feliz': '😄', 'Feliz': '😊', 'Neutro': '😐', 'Triste': '😞',
        'Ansioso': '😟', 'Irritado': '😡', 'Cansado': '😴', 'Grato': '🙏'
    };

    useEffect(() => {
        if (userToken) { 
            fetchPsyRecords();
        } else {
            setLoading(false);
            Alert.alert('Erro de Autenticação', 'Token de psicóloga não disponível. Por favor, faça login novamente.');
        }
    }, [userToken]); 

    const fetchPsyRecords = async () => {
        setLoading(true);
        setRefreshing(true); 
        try {
            const response = await fetch(API_PSY_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
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
            setAllRecords([]); 
        } finally {
            setLoading(false);
            setRefreshing(false); 
        }
    };

    const renderRecordItem = ({ item }) => (
        <View style={styles.recordCard}>
            {}
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

    if (loading && !refreshing) {
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
                    refreshControl={ 
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchPsyRecords}
                            colors={['#6a0dad']} 
                            tintColor={'#6a0dad'}
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
        backgroundColor: '#f0f4f8', 
        paddingTop: 40, 
    },
    title: {
        fontSize: 28, 
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
        padding: 18, 
        borderRadius: 10, 
        marginBottom: 12, 
        borderLeftWidth: 6,
        borderLeftColor: '#6a0dad', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, 
        shadowRadius: 4,
        elevation: 5,
    },
    patientInfo: {
        fontSize: 17, 
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#212529',
    },
    patientName: {
        color: '#4a4a4a', 
        fontWeight: 'normal',
    },
    recordDate: {
        fontSize: 13, 
        color: '#6c757d',
        marginBottom: 8, 
        fontStyle: 'italic',
    },
    recordHumor: {
        fontSize: 16, 
        fontWeight: '600',
        marginBottom: 8, 
        color: '#495057',
    },
    recordDescription: {
        fontSize: 15, 
        color: '#343a40',
        lineHeight: 22, 
        marginTop: 5,
    },
    psychologistNotes: {
        fontSize: 14, 
        fontStyle: 'italic',
        marginTop: 10,
        color: '#007bff', 
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
    }
});
