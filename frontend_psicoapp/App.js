import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import AdminHome from './screens/AdminHome';
import PacienteHome from './screens/PacienteHome';
import DiarioEmocional from './screens/DiarioEmocional';
import HistoricoPagamentos from './screens/HistoricoPagamentos';
import PsyViewScreen from './screens/PsyViewScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null); 
  const [loadingUser, setLoadingUser] = useState(true);
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userName = await AsyncStorage.getItem('userName');
        const userType = await AsyncStorage.getItem('userType');
        const userToken = await AsyncStorage.getItem('userToken'); 

        if (userId && userName && userType && userToken) { 
          setUser({ id: userId, nome: userName, tipo: userType, token: userToken });
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do AsyncStorage:', error);
      } finally {
        setLoadingUser(false); 
      }
    };

    loadUserFromStorage();
  }, []); 
  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando dados do usuário...</Text>
      </View>
    );
  }
  const getInitialRouteName = () => {
    if (user) {
      if (user.tipo === 'paciente') {
        return 'PacienteHome';
      } else if (user.tipo === 'psicologa') {
        return 'PsicologaHome'; 
      } else if (user.tipo === 'admin') {
        return 'AdminHome';
      }
    }
    return 'Login'; 
  };

  const initialRoute = getInitialRouteName();
  return (
    <NavigationContainer>
    {}
      <Stack.Navigator initialRouteName={initialRoute}>
        { 
          !user ? (
            <>
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} setUser={setUser} />}
              </Stack.Screen>
              <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar Conta' }} />
            </>
          ) : user.tipo === 'paciente' ? ( 
            <>
              <Stack.Screen name="PacienteHome" options={{ title: user?.nome ? `Olá, ${user.nome}` : 'Olá, Paciente' }}>
                {(props) => <PacienteHome {...props} user={user} setUser={setUser} />}
              </Stack.Screen>
              <Stack.Screen name="DiarioEmocional" options={{ title: 'Meu Diário' }}>
                {(props) => <DiarioEmocional {...props} user={user} />}
              </Stack.Screen>
            </>
          ) : user.tipo === 'psicologa' ? ( 
            <>
              <Stack.Screen name="PsicologaHome" options={{ title: user?.nome ? `Olá, Dra. ${user.nome}` : 'Olá, Psicóloga' }}>
                {(props) => <AdminHome {...props} user={user} setUser={setUser} />} 
              </Stack.Screen>
              <Stack.Screen name="DiarioGeralPsicologa" options={{ title: 'Diários dos Pacientes' }}>
                {(props) => <PsyViewScreen {...props} user={user} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="AdminHome" options={{ title: user?.nome ? `Olá, ${user.nome}` : 'Olá, Administrador' }}>
                {(props) => <AdminHome {...props} user={user} setUser={setUser} />}
              </Stack.Screen>
              <Stack.Screen name="HistoricoPagamentos" options={{ title: 'Histórico de Pagamentos' }}>
                {(props) => <HistoricoPagamentos {...props} user={user} />}
              </Stack.Screen>
            </>
          )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
});
