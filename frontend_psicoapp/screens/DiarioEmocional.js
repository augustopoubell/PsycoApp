// frontend_psicoapp/screens/DiarioEmocional.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';

// ATENÇÃO: Substitua 'SEU_ENDERECO_IP' pelo IP da sua máquina e a porta do seu backend!
const API_BASE_URL = 'http://192.168.1.88:5000/api/diario'; 

export default function DiarioEmocional({ route, navigation, user }) {
    // Pega o pacienteId e o token do objeto 'user' que foi passado via props do App.js
    const pacienteId = user ? user.id : null;
    const userToken = user ? user.token : null; // Pegando o token do usuário

    const [humorGeral, setHumorGeral] = useState('');
    const [descricao, setDescricao] = useState('');
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // Novo estado para controlar o salvamento

    const humorEmojis = {
        'Muito Feliz': '😄', 'Feliz': '😊', 'Neutro': '😐', 'Triste': '😞',
        'Ansioso': '😟', 'Irritado': '😡', 'Cansado': '😴', 'Grato': '🙏' // Adicionei alguns humores
    };

    useEffect(() => {
        if (pacienteId && userToken) { // Verificando se o token também está disponível
            carregarRegistros();
        } else {
            setLoading(false);
            Alert.alert('Erro de Autenticação', 'ID do paciente ou token não disponível. Por favor, faça login novamente.');
            // Opcional: navigation.navigate('Login'); para forçar o login
        }
    }, [pacienteId, userToken]); // Adicionei userToken como dependência

    const carregarRegistros = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/paciente/${pacienteId}`, { // Endpoint mais específico
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Adicionando o token de autenticação
                },
            });

            if (!response.ok) {
                const errorText = await response.text(); // Pega o texto do erro
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

        setSaving(true); // Inicia o estado de salvamento

        const novoRegistro = {
            pacienteId: pacienteId,
            humorGeral: humorGeral,
            descricao: descricao.trim(), // Remove espaços em branco extras
            emocoesEspecificas: [], // Manter vazio ou adicionar um campo para isso no futuro
            gatilhos: [], // Manter vazio ou adicionar um campo para isso no futuro
            atividades: [], // Manter vazio ou adicionar um campo para isso no futuro
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`, // Adicionando o token de autenticação
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
            carregarRegistros(); // Recarrega a lista após salvar
        } catch (error) {
            console.error('Erro ao salvar registro do diário: ', error);
            Alert.alert('Erro', `Não foi possível salvar o registro: ${error.message}`);
        } finally {
            setSaving(false); // Finaliza o estado de salvamento
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
                numberOfLines={4} // Sugere altura mínima para o TextInput
                style={styles.input}
                maxLength={500} // Limite de caracteres para a descrição
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
        paddingTop: 40, // Ajuste para mais espaço no topo
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
        marginBottom: 15, // Aumentei a margem
        color: '#555',
        textAlign: 'center',
    },
    moodSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 25, // Aumentei a margem
    },
    moodButton: {
        padding: 10,
        margin: 6, // Ajustei a margem entre os botões
        borderRadius: 12, // Aumentei o arredondamento
        backgroundColor: '#e9ecef',
        alignItems: 'center',
        width: 100, // Ajustei a largura
        borderWidth: 1,
        borderColor: '#ced4da',
        shadowColor: '#000', // Sombra para profundidade
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedMoodButton: {
        backgroundColor: '#D1C4E9', // Cor roxa clara, mais relacionada à Psicologia
        borderColor: '#673AB7', // Borda roxa mais escura
        borderWidth: 2,
    },
    moodEmoji: {
        fontSize: 36, // Aumentei o tamanho do emoji
        marginBottom: 5,
    },
    moodText: {
        fontSize: 13, // Levemente maior
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
        minHeight: 120, // Altura mínima um pouco maior
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        fontSize: 16,
        lineHeight: 22, // Melhorar legibilidade
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
        padding: 18, // Um pouco mais de padding
        borderRadius: 10,
        marginBottom: 12, // Um pouco mais de margem
        borderLeftWidth: 6, // Borda mais proeminente
        borderLeftColor: '#6a0dad', // Cor roxa consistente
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, // Sombra um pouco mais visível
        shadowRadius: 4,
        elevation: 5,
    },
    registroDate: {
        fontSize: 13, // Levemente maior
        color: '#888',
        marginBottom: 5,
        fontStyle: 'italic',
    },
    registroHumor: {
        fontSize: 19, // Levemente maior
        fontWeight: 'bold',
        marginBottom: 8, // Mais espaço
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
    // Adicionei estilo para a mensagem de nenhum registro
    noRecordsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
        fontStyle: 'italic',
    }
});