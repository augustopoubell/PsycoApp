import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';

const API_BASE_URL = 'http://192.168.1.88:5000/api/diario'; 

export default function DiarioEmocional({ route, navigation, user }) {
    const pacienteId = user ? user.id : null;
    const userToken = user ? user.token : null;
    const [humorGeral, setHumorGeral] = useState('');
    const [descricao, setDescricao] = useState('');
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const humorEmojis = {
        'Muito Feliz': '😄', 'Feliz': '😊', 'Neutro': '😐', 'Triste': '😞',
        'Ansioso': '😟', 'Irritado': '😡', 'Cansado': '😴', 'Grato': '🙏' 
    };

    useEffect(() => {
        if (pacienteId && userToken) { 
            carregarRegistros();
        } else {
            setLoading(false);
            Alert.alert('Erro de Autenticação', 'ID do paciente ou token não disponível. Por favor, faça login novamente.');
        }
    }, [pacienteId, userToken]);

    const carregarRegistros = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/paciente/${pacienteId}`, {
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
            setRegistros(data);
        } catch (error) {
            console.error('Erro ao carregar registros do diário: ', error);
            Alert.alert('Erro', `Não foi possível carregar os registros do diário: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const salvarRegistro = async () => {
        if (!pacienteId || !userToken) {
            Alert.alert('Erro', 'Não foi possível identificar o paciente ou o token. Tente fazer login novamente.');
            return;
        }
        if (!humorGeral || !descricao.trim()) {
            Alert.alert('Atenção', 'Por favor, selecione um humor e digite sua descrição.');
            return;
        }

        setSaving(true);

        const novoRegistro = {
            pacienteId: pacienteId,
            humorGeral: humorGeral,
            descricao: descricao.trim(),
            emocoesEspecificas: [], 
            gatilhos: [], 
            atividades: [], 
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(novoRegistro),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }

            Alert.alert('Sucesso', 'Registro do diário salvo!');
            setHumorGeral('');
            setDescricao('');
            carregarRegistros(); 
        } catch (error) {
            console.error('Erro ao salvar registro do diário: ', error);
            Alert.alert('Erro', `Não foi possível salvar o registro: ${error.message}`);
        } finally {
            setSaving(false); 
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.registroCard}>
            <Text style={styles.registroDate}>
                {new Date(item.dataRegistro).toLocaleDateString('pt-BR')} às{' '}
                {new Date(item.dataRegistro).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </Text>
            <Text style={styles.registroHumor}>
                Humor: {humorEmojis[item.humorGeral] || item.humorGeral}
            </Text>
            <Text style={styles.registroDescricao}>{item.descricao}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a0dad" />
                <Text style={styles.loadingText}>Carregando diário...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Diário Emocional</Text>

            <Text style={styles.subtitle}>Como você se sente hoje?</Text>
            <View style={styles.moodSelector}>
                {Object.keys(humorEmojis).map((humor) => (
                    <TouchableOpacity
                        key={humor}
                        style={[
                            styles.moodButton,
                            humorGeral === humor && styles.selectedMoodButton,
                        ]}
                        onPress={() => setHumorGeral(humor)}
                    >
                        <Text style={styles.moodEmoji}>{humorEmojis[humor]}</Text>
                        <Text style={styles.moodText}>{humor}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                placeholder='Descreva seus sentimentos e o que aconteceu...'
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={4}
                style={styles.input}
                maxLength={500} 
            />
            {saving ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <Button title='Salvar no Diário' onPress={salvarRegistro} color="#6a0dad" />
            )}

            <Text style={styles.historyTitle}>Seu Histórico de Registros:</Text>
            {registros.length === 0 ? (
                <Text style={styles.noRecordsText}>Nenhum registro ainda. Comece a adicionar!</Text>
            ) : (
                <FlatList
                    data={registros}
                    keyExtractor={(item) => item._id}
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
        paddingTop: 40, 
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15, 
        color: '#555',
        textAlign: 'center',
    },
    moodSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 25, 
    },
    moodButton: {
        padding: 10,
        margin: 6, 
        borderRadius: 12, 
        backgroundColor: '#e9ecef',
        alignItems: 'center',
        width: 100, 
        borderWidth: 1,
        borderColor: '#ced4da',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedMoodButton: {
        backgroundColor: '#D1C4E9', 
        borderColor: '#673AB7', 
        borderWidth: 2,
    },
    moodEmoji: {
        fontSize: 36,
        marginBottom: 5,
    },
    moodText: {
        fontSize: 13,
        textAlign: 'center',
        color: '#333',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        minHeight: 120, 
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        fontSize: 16,
        lineHeight: 22, 
    },
    historyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    list: {
        flex: 1,
    },
    registroCard: {
        backgroundColor: '#ffffff',
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
    registroDate: {
        fontSize: 13, 
        color: '#888',
        marginBottom: 5,
        fontStyle: 'italic',
    },
    registroHumor: {
        fontSize: 19, 
        fontWeight: 'bold',
        marginBottom: 8, 
        color: '#333',
    },
    registroDescricao: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
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
    noRecordsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
        fontStyle: 'italic',
    }
});
